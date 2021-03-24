import { getService } from '@nti/web-client';
import { Stores, Mixins } from '@nti/lib-store';
import { decorate } from '@nti/lib-commons';
import { mixin } from '@nti/lib-decorators';
import AppDispatcher from '@nti/lib-dispatcher';

export const KEYS = {
	administeredCourses: 'administeredCourses',
	courses: 'courses',
	books: 'books',
	communities: 'communities',
};

const initialValues = {
	loading: true,
	error: null,
	hasSearchTerm: false,
	...Object.keys(KEYS).reduce(
		// set all collection keys to null
		(acc, key) => ({ ...acc, [key]: null }),
		{}
	),
};

class HomePageStore extends Stores.BoundStore {
	constructor() {
		super();

		this.dispatcherID = AppDispatcher.register(this.handleDispatch);
		this.loaded = false;
		this.prevSearch = false;

		this.set({
			...initialValues,
		});
	}

	handleDispatch = event => {
		const type = event && (event.type || (event.action || {}).type);

		if (type === 'catalog:redeem' || type === 'course:drop') {
			this.reloadCourseFavorites();
		}
	};

	onSortChange = (collectionName, sortOn, sortDirection = 'ascending') => {
		console.log(collectionName, sortOn, sortDirection);
	};

	async load() {
		// on each load, clear the staged queue
		this.clearStaged();

		if (this.searchTerm) {
			this.loadSearchTerm();
		} else if (!this.loaded || this.prevSearch) {
			this.set({ ...initialValues });

			try {
				await Promise.all([
					this.loadFavorites(),
					this.loadBooks(),
					this.loadCommunities(),
					this.checkAdmin(),
					this.checkCatalog(),
				]);

				if (this.searchTerm) {
					return;
				}

				this.commitStaged();

				this.loaded = true;
				this.prevSearch = false;

				this.set({ loading: false });
			} catch (e) {
				this.set({ error: e, loading: false });
			}
		}
	}

	async loadSearchTerm() {
		this.loaded = false;

		this.set({
			...initialValues,
			hasSearchTerm: true,
		});

		clearTimeout(this.searchBufferTimeout);

		this.searchBufferTimeout = setTimeout(async () => {
			const searchTerm = this.searchTerm;

			try {
				await Promise.all([
					this.searchCourses(searchTerm),
					this.searchBooks(searchTerm),
					this.searchCommunities(searchTerm),
					this.checkAdmin(),
					this.checkCatalog(),
				]);

				if (searchTerm !== this.searchTerm) {
					return;
				}

				this.commitStaged();

				this.loaded = true;
				this.prevSearch = true;

				this.set({ loading: false });
			} catch (e) {
				this.set({ error: e, loading: false });
			}
		}, 300);
	}

	/**
	 * Flush the staged queue (without applying the data)
	 *
	 * @returns {null}      No return value
	 */
	clearStaged() {
		this.staged = {};
	}

	/**
	 * Add items to be set on the store (instead of setting them immediately, which triggers an event emit)
	 *
	 * @param {Object} obj Object containing key-value pairs to eventually be set on the store
	 * @returns {null}      No return value
	 */
	stageChanges(obj) {
		if (!this.staged) {
			this.staged = {};
		}

		for (let key of Object.keys(obj)) {
			this.staged[key] = obj[key];
		}
	}

	/**
	 * Flush the staged queue and set the data on the store, triggering an event emit
	 *
	 * @returns {null}      No return value
	 */
	commitStaged() {
		this.set(this.staged);

		this.clearStaged();
	}

	async checkAdmin() {
		const service = await getService();
		const admin = !!service.getWorkspace('SiteAdmin');
		this.set('admin', admin);
	}

	async checkCatalog() {
		const service = await getService();
		const hasCatalog = service.getCollection('Courses', 'Catalog')
			? true
			: false;
		this.set('hasCatalog', hasCatalog);
	}

	async searchCourses(searchTerm) {
		const service = await getService();
		const adminCollection = service.getCollection(
			'AdministeredCourses',
			'Courses'
		);
		const enrolledCollection = service.getCollection(
			'EnrolledCourses',
			'Courses'
		);

		const params = { filter: searchTerm, batchSize: 80, batchStart: 0 };

		const courses = await service.getBatch(enrolledCollection.href, params);
		const administeredCourses = await service.getBatch(
			adminCollection.href,
			params
		);

		this.stageChanges({
			[KEYS.courses]: courses.Items,
			[KEYS.administeredCourses]: administeredCourses.Items,
		});
	}

	async searchBooks(searchTerm) {
		const service = await getService();
		const booksCollection = service.getCollection(
			'VisibleContentBundles',
			'ContentBundles'
		);
		const booksBatch = await service.get(
			booksCollection.href + '?filter=' + searchTerm
		);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);

		this.stageChanges({ [KEYS.books]: booksParsed });
	}

	async searchCommunities(searchTerm) {
		function communityFilter({ alias, realname }) {
			const term = searchTerm.toLowerCase();
			return [alias, realname].some(n => n?.toLowerCase().includes(term));
		}

		try {
			const service = await getService();
			const communitiesCollection = await service.getCommunities();
			const communities = await communitiesCollection.load();

			this.stageChanges({
				[KEYS.communities]: (communities || []).filter(communityFilter),
			});
		} catch (e) {
			//swallow
		}
	}

	async loadFavorites() {
		const service = await getService();
		const adminCollection = service.getCollection(
			'AdministeredCourses',
			'Courses'
		);
		const enrolledCollection = service.getCollection(
			'EnrolledCourses',
			'Courses'
		);

		const [courses, administeredCourses] = await Promise.all(
			[enrolledCollection, adminCollection].map(c =>
				service.getBatch(c.getLink('Favorites'))
			)
		);

		this.stageChanges({
			[KEYS.courses]: courses.Items,
			[KEYS.administeredCourses]: administeredCourses.Items,
			totalCourses: courses.Total,
			totalAdministeredCourses: administeredCourses.Total,
		});
	}

	async reloadAdminFavorites() {
		if (this.searchTerm) {
			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				[KEYS.administeredCourses]: null,
			});

			try {
				let service = await getService();
				const adminCollection = service.getCollection(
					'AdministeredCourses',
					'Courses'
				);

				const administeredCourses = await service.getBatch(
					adminCollection.getLink('Favorites')
				);
				this.set({
					[KEYS.administeredCourses]: administeredCourses.Items,
					totalAdministeredCourses: administeredCourses.Total,
				});
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;

				this.set('loading', false);
			}
		}
	}

	async reloadCourseFavorites() {
		if (this.searchTerm) {
			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				[KEYS.courses]: null,
			});

			try {
				let service = await getService();
				const enrolledCollection = service.getCollection(
					'EnrolledCourses',
					'Courses'
				);

				const courses = await service.getBatch(
					enrolledCollection.getLink('Favorites')
				);
				this.set({
					[KEYS.courses]: courses.Items,
					totalCourses: courses.Total,
				});
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;

				this.set('loading', false);
			}
		}
	}

	async reloadCommunities() {
		if (this.searchTerm) {
			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				[KEYS.communities]: null,
			});

			try {
				const service = await getService();
				const communities = service.getCommunities();
				const fetchComm = await communities.load();

				this.set({
					[KEYS.communities]: fetchComm,
				});
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;
				this.set('loading', false);
			}
		}
	}

	async loadBooks() {
		let service = await getService();
		const booksCollection = service.getCollection(
			'VisibleContentBundles',
			'ContentBundles'
		);
		const booksBatch = await service.get(booksCollection.href);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);

		this.stageChanges({ [KEYS.books]: booksParsed });
	}

	async loadCommunities() {
		const service = await getService();
		const communities = await service.getCommunities();
		const fetchedComm = await communities.load(true);

		this.stageChanges({ [KEYS.communities]: fetchedComm });
	}
}

export default decorate(HomePageStore, [mixin(Mixins.Searchable)]);

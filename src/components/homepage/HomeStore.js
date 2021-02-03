import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';
import AppDispatcher from '@nti/lib-dispatcher';

export default
@mixin(Mixins.Searchable)
class HomePageStore extends Stores.BoundStore {
	constructor () {
		super();

		this.dispatcherID = AppDispatcher.register(this.handleDispatch);
		this.loaded = false;
		this.prevSearch = false;

		this.set({
			loading: true,
			error: null,
			courses: null,
			administeredCourses: null,
			books: null,
			communities: null,
			hasSearchTerm: false
		});
	}

	handleDispatch = (event) => {
		let type = event && (event.type || (event.action || {}).type);

		if (!type) {
			return;
		} else if (type === 'catalog:redeem' || type === 'course:drop') {
			this.reloadCourseFavorites();
		}
	}

	async load () {
		// on each load, clear the pending queue
		this.clearPending();

		if (this.searchTerm) {
			this.loaded = false;

			this.set({
				loading: true,
				error: null,
				courses: null,
				administeredCourses: null,
				books: null,
				communities: null,
				hasSearchTerm: true
			});
			this.loadSearchTerm();
		}
		else if(!this.loaded || this.prevSearch) {
			this.set({
				loading: true,
				error: null,
				courses: null,
				administeredCourses: null,
				books: null,
				communities: null,
				hasSearchTerm: false
			});

			try {
				const libraryPromises = [
					this.loadFavorites(),
					this.loadBooks(),
					this.loadCommunities(),
					this.checkAdmin(),
					this.checkCatalog()
				];

				await Promise.all(libraryPromises);

				if(this.searchTerm) {
					return;
				}

				this.applyPending();

				this.loaded = true;
				this.prevSearch = false;

				this.set({loading: false});
			} catch (e) {
				this.set({error: e, loading: false});
			}
		}
	}

	async loadSearchTerm () {
		clearTimeout(this.searchBufferTimeout);

		this.searchBufferTimeout = setTimeout(async () => {
			const searchTerm = this.searchTerm;

			try {
				const librarySearchPromises = [
					this.searchCourses(searchTerm),
					this.searchBooks(searchTerm),
					this.searchCommunities(searchTerm),
					this.checkAdmin(),
					this.checkCatalog()
				];

				await Promise.all(librarySearchPromises);

				if (searchTerm !== this.searchTerm) { return; }

				this.applyPending();

				this.loaded = true;
				this.prevSearch = true;

				this.set({loading: false});
			} catch (e) {
				this.set({error: e, loading: false});
			}
		}, 300);
	}

	/**
	 * Flush the pending queue (without applying the data)
	 *
	 * @returns {null}      No return value
	 */
	clearPending () {
		this.pending = {};
	}

	/**
	 * Add items to be set on the store (instead of setting them immediately, which triggers an event emit)
	 *
	 * @param {Object} obj Object containing key-value pairs to eventually be set on the store
	 * @returns {null}      No return value
	 */
	addToPending (obj) {
		if(!this.pending) {
			this.pending = {};
		}

		for(let key of Object.keys(obj)) {
			this.pending[key] = obj[key];
		}
	}

	/**
	 * Flush the pending queue and set the data on the store, triggering an event emit
	 *
	 * @returns {null}      No return value
	 */
	applyPending () {
		this.set(this.pending);

		this.clearPending();
	}

	async checkAdmin () {
		let service = await getService();
		const admin = service.getWorkspace('SiteAdmin') ? true : false;
		this.set('admin', admin);
	}

	async checkCatalog () {
		let service = await getService();
		const hasCatalog = service.getCollection('Courses', 'Catalog') ? true : false;
		this.set('hasCatalog', hasCatalog);
	}

	async searchCourses (searchTerm) {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const params = {filter: searchTerm, batchSize: 80, batchStart: 0};

		const courses = await service.getBatch(enrolledCollection.href, params);
		const administeredCourses = await service.getBatch(adminCollection.href, params);

		this.addToPending({
			'courses': courses.Items,
			'administeredCourses': administeredCourses.Items
		});
	}

	async searchBooks (searchTerm) {
		let service = await getService();
		const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
		const booksBatch = await service.get(booksCollection.href + '?filter=' + searchTerm);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);

		this.addToPending({'books': booksParsed});
	}

	async searchCommunities (searchTerm) {
		function communityFilter (community) {
			return community.alias.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0 || community.realname.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
		}

		try {
			let service = await getService();
			const communitiesCollection = await service.getCommunities();
			const communities = await communitiesCollection.load();


			this.addToPending({'communities': (communities || []).filter(communityFilter)});
		} catch (e) {
			//swallow
		}
	}

	async loadFavorites () {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const courses = await service.getBatch(enrolledCollection.getLink('Favorites'));
		const administeredCourses = await service.getBatch(adminCollection.getLink('Favorites'));

		this.addToPending({
			'courses': courses.Items,
			'administeredCourses': administeredCourses.Items,
			'totalCourses': courses.Total,
			'totalAdministeredCourses': administeredCourses.Total
		});
	}

	async reloadAdminFavorites () {
		if (this.searchTerm) {
			this.loaded = false;

			this.set({
				loading: true,
				error: null,
				courses: null,
				administeredCourses: null,
				books: null,
				communities: null,
				hasSearchTerm: true
			});
			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				administeredCourses: null
			});

			try {
				let service = await getService();
				const adminCollection = service.getCollection('AdministeredCourses', 'Courses');

				const administeredCourses = await service.getBatch(adminCollection.getLink('Favorites'));
				this.set({
					'administeredCourses': administeredCourses.Items,
					'totalAdministeredCourses': administeredCourses.Total
				});
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;

				this.set('loading', false);
			}
		}
	}

	async reloadCourseFavorites () {
		if (this.searchTerm) {
			this.loaded = false;

			this.set({
				loading: true,
				error: null,
				courses: null,
				administeredCourses: null,
				books: null,
				communities: null,
				hasSearchTerm: true
			});
			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				courses: null
			});

			try {
				let service = await getService();
				const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

				const courses = await service.getBatch(enrolledCollection.getLink('Favorites'));
				this.set({
					'courses': courses.Items,
					'totalCourses': courses.Total
				});
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;

				this.set('loading', false);
			}
		}
	}

	async reloadCommunities () {
		if (this.searchTerm) {
			this.loaded = false;

			this.set({
				loading: true,
				error: null,
				courses: null,
				administeredCourses: null,
				books: null,
				communities: null,
				hasSearchTerm: true
			});
			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				communities: null
			});

			try {
				const service = await getService();
				const communities = service.getCommunities();
				const fetchComm = await communities.load();

				this.set({
					communities: fetchComm
				});
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;
				this.set('loading', false);
			}
		}
	}

	async loadBooks () {
		let service = await getService();
		const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
		const booksBatch = await service.get(booksCollection.href);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);

		this.addToPending({'books': booksParsed});
	}

	async loadCommunities () {
		let service = await getService();
		const communities = await service.getCommunities();
		const fetchedComm = await communities.load(true);

		this.addToPending({'communities': fetchedComm});
	}
}

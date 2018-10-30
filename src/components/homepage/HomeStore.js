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
					this.checkAdmin()
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
		const searchTerm = this.searchTerm;

		try {
			const librarySearchPromises = [
				this.searchCourses(searchTerm),
				this.searchBooks(searchTerm),
				this.searchCommunities(searchTerm),
				this.checkAdmin()
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
	}

	/**
	 * Flush the pending queue (without applying the data)
	 *
	 * @return {null}      No return value
	 */
	clearPending () {
		this.pending = {};
	}

	/**
	 * Add items to be set on the store (instead of setting them immediately, which triggers an event emit)
	 *
	 * @param {Object} obj Object containing key-value pairs to eventually be set on the store
	 * @return {null}      No return value
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
	 * @return {null}      No return value
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

	async searchCourses (searchTerm) {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const courses = await service.getBatch(enrolledCollection.href + '?filter=' + searchTerm);
		const administeredCourses = await service.getBatch(adminCollection.href + '?filter=' + searchTerm);

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
		let service = await getService();
		const communitiesCollection = await service.getCommunities();
		const communities = await communitiesCollection.fetch();

		function communityFilter (community) {
			return community.alias.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0 || community.realname.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
		}

		this.addToPending({'communities': communities.filter(communityFilter)});
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

	async loadBooks () {
		let service = await getService();
		const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
		const booksBatch = await service.get(booksCollection.href);
		const bundles = booksBatch.titles.map(x => {
			x.homepage = true;
			return x;
		});

		const booksPromises = bundles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);

		this.addToPending({'books': booksParsed});
	}

	async loadCommunities () {
		let service = await getService();
		const communities = await service.getCommunities();
		const fetchedComm = await communities.fetch();

		this.addToPending({'communities': fetchedComm});
	}
}

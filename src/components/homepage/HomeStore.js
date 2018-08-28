import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

@mixin(Mixins.Searchable)
export default class HomePageStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: false,
			error: null,
			courses: null,
			administeredCourses: null,
			books: null,
			communities: null
		});
	}

	async load () {
		this.set({
			loading: true,
			error: null,
			courses: null,
			administeredCourses: null,
			books: null,
			communities: null
		});

		this.emitChange('loading');

		if (this.searchTerm) {
			this.loadSearchTerm();
		} else {
			try {
				this.loadFavorites();
				this.loadBooks();
				this.loadCommunities();
				this.checkAdmin();
			} catch (e) {
				this.set('error', e);
				this.emitChange('error');
			} finally {
				this.set('loading', false);
				this.emitChange('loading');
			}
		}
	}

	loadSearchTerm () {
		const searchTerm = this.searchTerm;

		try {
			if (searchTerm !== this.searchTerm) { return; }

			this.searchCourses(searchTerm);
			this.searchBooks(searchTerm);
			this.searchCommunities(searchTerm);
		} catch (e) {
			this.set('error', e);
			this.emitChange('error');
		} finally {
			this.set('loading', false);
			this.emitChange('loading');
		}
	}

	async checkAdmin () {
		let service = await getService();
		const admin = service.getWorkspace('SiteAdmin') ? true : false;
		this.set('admin', admin);


		this.emitChange();
	}

	async searchCourses (searchTerm) {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const courses = await service.getBatch(enrolledCollection.href + '?filter=' + searchTerm);
		const administeredCourses = await service.getBatch(adminCollection.href + '?filter=' + searchTerm);
		this.set('courses', courses.Items);
		this.set('administeredCourses', administeredCourses.Items);

		this.emitChange();
	}

	async searchBooks (searchTerm) {
		let service = await getService();
		const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
		const booksBatch = await service.get(booksCollection.href + '?filter=' + searchTerm);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);
		this.set('books', booksParsed);


		this.emitChange();
	}

	async searchCommunities (searchTerm) {
		let service = await getService();
		const communitiesCollection = await service.getCommunities();
		const communities = await communitiesCollection.fetch();

		function communityFilter (community) {
			return community.alias.toLowerCase().startsWith(searchTerm.toLowerCase()) || community.realname.toLowerCase().startsWith(searchTerm.toLowerCase());
		}

		this.set('communities', communities.filter(communityFilter));


		this.emitChange();
	}

	async loadFavorites () {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const courses = await service.getBatch(enrolledCollection.getLink('Favorites'));
		const administeredCourses = await service.getBatch(adminCollection.getLink('Favorites'));
		this.set('courses', courses.Items);
		this.set('administeredCourses', administeredCourses.Items);

		this.emitChange();
	}

	async loadBooks () {
		let service = await getService();
		const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
		const booksBatch = await service.get(booksCollection.href);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);
		this.set('books', booksParsed);


		this.emitChange();
	}

	async loadCommunities () {
		let service = await getService();
		const communities = await service.getCommunities();
		this.set('communities', await communities.fetch());


		this.emitChange();
	}
}

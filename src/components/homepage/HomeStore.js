import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

export default
@mixin(Mixins.Searchable)
class HomePageStore extends Stores.BoundStore {
	constructor () {
		super();

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

	async load () {
		this.set({
			loading: true,
			error: null,
			courses: null,
			administeredCourses: null,
			books: null,
			communities: null,
			hasSearchTerm: false
		});

		if (this.searchTerm) {
			this.set('hasSearchTerm', true);
			this.loadSearchTerm();
		} else {
			try {
				const libraryPromises = [
					this.loadFavorites(),
					this.loadBooks(),
					this.loadCommunities(),
					this.checkAdmin()
				];

				await Promise.all(libraryPromises);
			} catch (e) {
				this.set('error', e);
			} finally {
				this.set('loading', false);
			}
		}
	}

	async loadSearchTerm () {
		const searchTerm = this.searchTerm;

		try {
			if (searchTerm !== this.searchTerm) { return; }

			const librarySearchPromises = [
				this.searchCourses(searchTerm),
				this.searchBooks(searchTerm),
				this.searchCommunities(searchTerm),
				this.checkAdmin()
			];

			await Promise.all(librarySearchPromises);
		} catch (e) {
			this.set('error', e);
		} finally {
			this.set('loading', false);
		}
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
		this.set({
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
		this.set('books', booksParsed);
	}

	async searchCommunities (searchTerm) {
		let service = await getService();
		const communitiesCollection = await service.getCommunities();
		const communities = await communitiesCollection.fetch();

		function communityFilter (community) {
			return community.alias.toLowerCase().startsWith(searchTerm.toLowerCase()) || community.realname.toLowerCase().startsWith(searchTerm.toLowerCase());
		}

		this.set('communities', communities.filter(communityFilter));
	}

	async loadFavorites () {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const courses = await service.getBatch(enrolledCollection.getLink('Favorites'));
		const administeredCourses = await service.getBatch(adminCollection.getLink('Favorites'));
		this.set({
			'courses': courses.Items,
			'administeredCourses': administeredCourses.Items
		});
	}

	async reloadAdminFavorites () {
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
				'administeredCourses': administeredCourses.Items
			});
		} catch (e) {
			this.set('error', e);
		} finally {
			this.set('loading', false);
		}
	}

	async reloadCourseFavorites () {
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
				'courses': courses.Items
			});
		} catch (e) {
			this.set('error', e);
		} finally {
			this.set('loading', false);
		}
	}

	async loadBooks () {
		let service = await getService();
		const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
		const booksBatch = await service.get(booksCollection.href);
		const booksPromises = booksBatch.titles.map(x => service.getObject(x));
		const booksParsed = await Promise.all(booksPromises);
		this.set('books', booksParsed);
	}

	async loadCommunities () {
		let service = await getService();
		const communities = await service.getCommunities();
		this.set('communities', await communities.fetch());
	}
}

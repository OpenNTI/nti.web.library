import {getService} from '@nti/web-client';
import {Stores} from '@nti/lib-store';

export default class Store extends Stores.SimpleStore {

	constructor () {
		super();

		this.set('loading', false);
		this.set('courses', null);
		this.set('administeredCourses', null);
		this.set('books', null);
		this.set('communities', null);
		this.set('error', null);
		this.set('admin', null);
	}

	loadLibrary () {
		this.doLoad();
	}

	async doLoad () {
		this.set('library', null);
		this.set('loading', true);
		this.emitChange('loading');

		try {
			let service = await getService();
			const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
			const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

			const courses = await service.getBatch(enrolledCollection.getLink('Favorites'));
			const administeredCourses = await service.getBatch(adminCollection.getLink('Favorites'));

			const communities = await service.getCommunities();

			const booksCollection = service.getCollection('VisibleContentBundles', 'ContentBundles');
			const booksBatch = await service.get(booksCollection.href);
			const booksPromises = booksBatch.titles.map(x => service.getObject(x));
			const booksParsed = await Promise.all(booksPromises);

			const admin = service.getWorkspace('SiteAdmin') ? true : false;

			this.set('admin', admin);
			this.set('courses', courses.Items);
			this.set('administeredCourses', administeredCourses.Items);
			this.set('books', booksParsed);
			this.set('communities', await communities.fetch());
			this.emitChange('admin', 'courses', 'administeredCourses', 'books', 'communities');
		} catch (e) {
			this.set('error', e);
			this.emitChange('error');
		} finally {
			this.set('loading', false);
			this.emitChange('loading');
		}
	}
}

import { getService } from '@nti/web-client';

import { COLLECTION_NAMES } from '../store/constants';
import BaseCourseStore from '../store/BaseCourseStore';

// collections in the 'Courses' workspace are titled
// 'AllCourses', 'EnrolledCourses', 'AdministeredCourses';
// TODO: unify/align the KEYS constants
export const KEYS = {
	administeredCourses: COLLECTION_NAMES.administeredCourses,
	courses: COLLECTION_NAMES.enrolledCourses,
	books: 'books',
	communities: 'communities',
};

class HomePageStore extends BaseCourseStore {
	// constructor() {
	// 	super();

	// 	this.dispatcherID = AppDispatcher.register(this.handleDispatch);
	// 	this.loaded = false;
	// 	this.prevSearch = false;

	// 	this.set({
	// 		...initialValues,
	// 	});
	// }

	loaders = {
		[KEYS.communities]: async ({ searchTerm }) => {
			const term = searchTerm?.toLowerCase();
			const filterFn = term
				? x => x
				: ({ alias, realname }) =>
						[alias, realname].some(n =>
							n?.toLowerCase().includes(term)
						);
			return getService()
				.then(service => service.getCommunities())
				.then(communities => communities.load(true))
				.then(items => items.filter(filterFn));
		},
		[KEYS.administeredCourses]: ({ currentValue }) =>
			this.loadCollection(
				COLLECTION_NAMES.administeredCourses,
				'Courses',
				currentValue // pass current state to provide sortOn, sortDirection, etc.
			),
		[KEYS.courses]: ({ currentValue }) =>
			this.loadCollection(
				COLLECTION_NAMES.enrolledCourses,
				'Courses',
				currentValue // pass current state to provide sortOn, sortDirection, etc.
			),
		[KEYS.books]: ({ currentValue }) =>
			this.loadCollection(
				'VisibleContentBundles',
				'ContentBundles',
				currentValue, // pass current state to provide sortOn, sortDirection, etc.
				(batch, service) =>
					Promise.all(batch.titles.map(x => service.getObject(x))) // preprocess batch items
			),
		admin: async () => !!(await getService()).getWorkspace('SiteAdmin'),
		hasCatalog: async () =>
			!!(await getService()).getCollection('Courses', 'Catalog'),
	};
}

export default HomePageStore;

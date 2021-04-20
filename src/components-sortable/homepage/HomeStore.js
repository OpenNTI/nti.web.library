import { getService } from '@nti/web-client';
import { Models } from '@nti/lib-interfaces';

import { COLLECTION_NAMES } from '../store/constants';
import BaseCourseStore from '../store/BaseCourseStore';

const {
	library: { AdministeredCoursesDataSource, EnrolledCoursesDataSource },
} = Models;

// collections in the 'Courses' workspace are titled
// 'AllCourses', 'EnrolledCourses', 'AdministeredCourses';
// TODO: unify/align the KEYS constants
export const KEYS = {
	administeredCourses: COLLECTION_NAMES.administeredCourses,
	courses: COLLECTION_NAMES.enrolledCourses,
	books: 'books',
	communities: 'communities',
};

export class Store extends BaseCourseStore {
	constructor() {
		super({ batchSize: 8 });

		(async () => {
			const service = await getService();
			this.#dataSources[
				KEYS.administeredCourses
			] = new AdministeredCoursesDataSource(service);
			this.#dataSources[KEYS.courses] = new EnrolledCoursesDataSource(
				service
			);
		})();
	}

	KEYS = KEYS;

	#dataSources = {};
	#sortOptions = {};

	getSortOptions = collectionName =>
		(this.#sortOptions[collectionName] = this.#sortOptions[
			collectionName
		] || [
			...new Set([
				'favorites',
				...(this.#dataSources[collectionName]?.sortOptions || []),
			]),
		]).filter(o => o !== 'availability');

	loaders = {
		[KEYS.communities]: async ({ searchTerm }) => {
			const term = searchTerm?.toLowerCase();
			const filterFn = !term
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

		// originally used to fetch the courses; now it just passes the sort info through.
		// we should rework this for better clarity
		[KEYS.administeredCourses]: ({
			currentValue: {
				sortOn = 'favorites',
				sortDirection,
				batchSize = 8,
			} = {},
		}) => ({ sortOn, sortDirection, batchSize }),

		// originally used to fetch the courses; now it just passes the sort info through.
		// we should rework this for better clarity
		[KEYS.courses]: ({
			currentValue: {
				sortOn = 'favorites',
				sortDirection,
				batchSize = 8,
			} = {},
		}) => ({ sortOn, sortDirection, batchSize }),

		[KEYS.books]: async ({
			currentValue: { sortOn, sortDirection, batchSize = 8 } = {},
		}) => {
			const service = await getService();
			const { href } = service.getCollection(
				'VisibleContentBundles',
				'ContentBundles'
			);
			const batch = await service.get(href, {
				sortOn,
				sortDirection,
				batchSize,
			});

			const items = await Promise.all(
				batch.titles.map(x => service.getObject(x))
			);
			return { items };
		},
		admin: async () => !!(await getService()).getWorkspace('SiteAdmin'),
		hasCatalog: async () =>
			!!(await getService()).getCollection('Courses', 'Catalog'),
	};
}

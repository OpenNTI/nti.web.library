import { Models } from '@nti/lib-interfaces';

import { COLLECTION_NAMES as COLLECTIONS } from '../constants';

const MODELS_BY_COLLECTION = {
	[COLLECTIONS.administeredCourses]:
		Models.library.AdministeredCoursesDataSource,
	[COLLECTIONS.enrolledCourses]: Models.library.EnrolledCoursesDataSource,
	[COLLECTIONS.books]: Models.library.BooksDataSource,
};

// statically compute a mapping of collection names to sort options
const SortsByCollection = Object.entries(MODELS_BY_COLLECTION).reduce(
	(acc, [coll, { sortOptions = [] } = {}]) => ({
		...acc,
		[coll]: sortOptions,
	}),
	{}
);

export const getSortOptions = collectionName =>
	SortsByCollection[collectionName] || [];

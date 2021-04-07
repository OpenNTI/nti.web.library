import BaseCourseStore from './BaseCourseStore';
import { COLLECTION_NAMES } from './constants';

export class CourseStoreAdmin extends BaseCourseStore {
	loaders = {
		[COLLECTION_NAMES.administeredCourses]: ({ currentValue }) =>
			this.loadCollection(
				COLLECTION_NAMES.administeredCourses,
				'Courses',
				currentValue // pass current state to provide sortOn, sortDirection, etc.
			),
	};
}

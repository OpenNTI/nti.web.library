import BaseCourseStore from './BaseCourseStore';
import { COLLECTION_NAMES } from './constants';

export class CourseStoreEnrolled extends BaseCourseStore {
	loaders = {
		[COLLECTION_NAMES.enrolledCourses]: ({ currentValue }) =>
			this.loadCollection(
				COLLECTION_NAMES.enrolledCourses,
				'Courses',
				currentValue // pass current state to provide sortOn, sortDirection, etc.
			),
	};
}

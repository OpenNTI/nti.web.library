import React from 'react';

import { scoped } from '@nti/lib-locale';
import { decorate } from '@nti/lib-commons';
import { searchable, contextual } from '@nti/web-search';

import Courses from './containers/CoursesContainer';
import { CourseStoreAdmin as Store } from './store/CourseStoreAdmin';
import { COLLECTION_NAMES } from './store/constants';

const COLLECTION = COLLECTION_NAMES.administeredCourses;

const t = scoped('library.components.CourseList', {
	admin: 'Administered Courses',
	courses: 'Courses',
	empty: 'No courses found.',
	add: 'Add Courses',
});

function List({ loading, hasSearchTerm, onSortChange, courses, store }) {
	const canShowCoursesSection = true;
	const hasCourses = courses?.length;
	// const emptySearch = hasSearchTerm && !hasCourses;
	const onModificationCourse = console.log;

	return (
		<div>
			{((!hasSearchTerm && canShowCoursesSection) ||
				(hasSearchTerm && hasCourses)) && (
				<Courses
					admin
					items={courses?.items}
					sortOptions={store.getSortOptions(COLLECTION)}
					onSortChange={(sortOn, sortDirection) =>
						onSortChange(COLLECTION, sortOn, sortDirection)
					}
					onModification={onModificationCourse}
				/>
			)}
		</div>
	);
}

export const CourseListAdmin = decorate(List, [
	searchable(),
	contextual(t('home')),
	Store.connect({
		[COLLECTION]: 'courses',
		loading: 'loading',
		hasSearchTerm: 'hasSearchTerm',
		error: 'error',
		onSortChange: 'onSortChange',
	}),
]);

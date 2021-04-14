import { scoped } from '@nti/lib-locale';
import { Collection } from '@nti/web-course';

const t = scoped('library.components.SectionTitle', {
	admin: 'Administered Courses',
	courses: 'Courses',
	upcomingcourses: 'Upcoming Courses',
	currentcourses: 'Current Courses',
	archivedcourses: 'Archived Courses',
	communities: 'Communities',
	books: 'Books',
});

export const getSectionTitle = (section, sortedOn) => {
	const sectionName = t(section);
	const sortName = sortedOn
		? ' ' + Collection.getSortOptionText(sortedOn)
		: '';
	return `${sectionName}${sortName}`;
};

getSectionTitle.isMissing = (...args) => t.isMissing(...args);

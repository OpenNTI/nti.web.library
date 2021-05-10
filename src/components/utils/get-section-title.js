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

export const getSectionTitleStrings = (section, sortedOn) => {
	const name = t(section);
	const sort =
		sortedOn && sortedOn !== 'favorites'
			? ' ' + Collection.getSortOptionText(sortedOn)
			: '';
	return { name, sort };
};

export const getSectionTitle = (section, sortedOn) => {
	return Object.values(getSectionTitleStrings(section, sortedOn)).join(' ');
};

getSectionTitle.isMissing = (...args) => t.isMissing(...args);

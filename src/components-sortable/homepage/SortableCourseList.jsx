import React from 'react';
import PropTypes from 'prop-types';

import { CollectionSortable as Collection } from '@nti/web-course';
import { Menu } from '@nti/web-commons';

import SectionTitle from '../SectionTitle';

const { CourseList } = Collection;

const getSectionTitle = (section, sortedOn) => {
	const sectionName = SectionTitle.getTitle(section);
	const sortName = sortedOn
		? ' ' + Collection.getSortOptionText(sortedOn)
		: '';
	return `${sectionName}${sortName}`;
};

const sortOptions = [
	'favorites',
	'createdTime',
	'provideruniqueid',
	'lastSeenTime',
	'title',
];

SortableCourseList.propTypes = {
	collection: PropTypes.oneOf(['AdministeredCourses', 'EnrolledCourses']),
	searchTerm: PropTypes.string,
};

export function SortableCourseList({ collection, searchTerm }) {
	const [sortOn, setSortOn] = React.useState();

	return (
		<div className="library-section">
			<CourseList
				collection={collection}
				sortOn={sortOn}
				searchTerm={searchTerm}
				getSectionTitle={getSectionTitle}
			>
				<div slot="heading" className="library-section-heading">
					<Menu.Select
						getText={Collection.getSortOptionText}
						value={sortOn}
						title={getSectionTitle(collection, sortOn)}
						options={sortOptions}
						onChange={setSortOn}
					/>
				</div>
			</CourseList>
		</div>
	);
}

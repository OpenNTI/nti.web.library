import './SectionTitle.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const t = scoped('library.components.SectionTitle', {
	admin: 'Administered Courses',
	courses: 'Courses',
	upcomingcourses: 'Upcoming Courses',
	currentcourses: 'Current Courses',
	archivedcourses: 'Archived Courses',
	communities: 'Communities',
	books: 'Books'
});


SectionTitle.propTypes = {
	section: PropTypes.string.isRequired,
	href: PropTypes.string
};

export default function SectionTitle (props) {
	const {section, href} = props;
	let Component = 'h1';

	let p = {
		className: 'library-section-title',
		children: t(section),
		href
	};

	return (
		<Component {...p}/>
	);
}

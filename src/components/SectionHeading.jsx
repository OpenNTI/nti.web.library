import PropTypes from 'prop-types';
import React from 'react';
import {LinkTo} from '@nti/web-routing';
import {Connectors} from '@nti/lib-store';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

export default
@Connectors.Any.connect({
	courses: 'courses',
	totalCourses: 'totalCourses',
	administeredCourses: 'administeredCourses',
	totalAdministeredCourses: 'totalAdministeredCourses'
})
class SectionHeading extends React.Component {
	static propTypes = {
		section: PropTypes.string.isRequired,
		date: PropTypes.string,
		empty: PropTypes.bool,
		courses: PropTypes.array,
		totalCourses: PropTypes.number,
		administeredCourses: PropTypes.array,
		totalAdministeredCourses: PropTypes.number
	}

	showSeeAll () {
		const {section, courses, totalCourses, administeredCourses, totalAdministeredCourses} = this.props;

		if(section === 'courses') {
			return (courses && courses.length) < totalCourses;
		} else if(section === 'admin') {
			return (administeredCourses && administeredCourses.length) < totalAdministeredCourses;
		}

		return false;
	}

	render () {
		const {section, date, empty} = this.props;

		return (
			<div className="library-section-heading">
				<SectionTitle section={section} />
				{(section === 'courses' || section === 'admin') && (
					<div className="course-section-heading">
						{section === 'courses' ? (
							<AddButton />
						) : (
							<div />
						)}

						{!empty && this.showSeeAll() && (
							<LinkTo.Name name={section === 'admin' ? ('library-admin-courses') : ('library-courses')} className="see-all">
							See All
							</LinkTo.Name>
						)}
					</div>
				)}
				{section === 'archivedcourses' && (
					<div className="course-section-heading-date">
						{date}
					</div>
				)}

			</div>
		);
	}
}

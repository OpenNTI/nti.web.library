import PropTypes from 'prop-types';
import React from 'react';
import {LinkTo} from '@nti/web-routing';
import {Connectors} from '@nti/lib-store';
import {Layouts} from '@nti/web-commons';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

const {Responsive} = Layouts;

export default
@Connectors.Any.connect({
	courses: 'courses',
	totalCourses: 'totalCourses',
	administeredCourses: 'administeredCourses',
	totalAdministeredCourses: 'totalAdministeredCourses',
	hasSearchTerm: 'hasSearchTerm'
})
class SectionHeading extends React.Component {
	static propTypes = {
		section: PropTypes.string.isRequired,
		date: PropTypes.string,
		empty: PropTypes.bool,
		courses: PropTypes.array,
		totalCourses: PropTypes.number,
		administeredCourses: PropTypes.array,
		totalAdministeredCourses: PropTypes.number,
		hasSearchTerm: PropTypes.bool
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		basePath: PropTypes.string
	}

	showSeeAll () {
		const {section, courses, totalCourses, administeredCourses, totalAdministeredCourses, hasSearchTerm} = this.props;

		if(section === 'courses' && !hasSearchTerm) {
			return (courses && courses.length) < totalCourses;
		} else if(section === 'admin' && !hasSearchTerm) {
			return (administeredCourses && administeredCourses.length) < totalAdministeredCourses;
		}

		return false;
	}

	render () {
		const {section, date, empty} = this.props;
		const { router, basePath } = this.context;
		let base;

		if(Responsive.isMobileContext()) {
			base = basePath;
		} else {
			base = router.baseroute ? '/' + router.baseroute.split('/')[1] + '/' : '';
		}

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
							<LinkTo.Path to={section === 'admin' ? (base + 'library/admin-courses') : (base + 'library/courses')} className="see-all">
							See All
							</LinkTo.Path>
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

import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { LinkTo } from '@nti/web-routing';
import { Connectors } from '@nti/lib-store';
import { Layouts, Menu } from '@nti/web-commons';
import { Collection } from '@nti/web-course';

import { getSectionTitle } from './utils/get-section-title.js';
import AddButton from './AddButton';
import './SectionHeading.scss';

const { Responsive } = Layouts;

class SectionHeading extends React.Component {
	static propTypes = {
		section: PropTypes.string.isRequired,
		date: PropTypes.string,
		empty: PropTypes.bool,
		hasMore: PropTypes.bool,
		courses: PropTypes.shape({
			items: PropTypes.array,
			total: PropTypes.number,
			sortOn: PropTypes.string,
			sortDirection: PropTypes.string,
		}),
		admin: PropTypes.shape({
			items: PropTypes.array,
			total: PropTypes.number,
			sortOn: PropTypes.string,
			sortDirection: PropTypes.string,
		}),
		hasSearchTerm: PropTypes.bool,
		sortOptions: PropTypes.arrayOf(PropTypes.string),
		onSortChange: PropTypes.func,
	};

	static contextTypes = {
		router: PropTypes.object.isRequired,
		basePath: PropTypes.string,
	};

	showSeeAll() {
		const { hasSearchTerm, hasMore } = this.props;
		return !hasSearchTerm && hasMore;
		// const { section, hasSearchTerm } = this.props;

		// const { items: { length } = [], total = 0 } = this.props[section] ?? {}; // get data for 'courses' or 'admin', e.g. { items: [course, course], total: 99, etc. }

		// return !hasSearchTerm && length < total;
	}

	render() {
		const { section, date, empty, sortOptions, onSortChange } = this.props;
		const data = this.props[section] || {};

		const { router, basePath } = this.context;
		let base;

		if (Responsive.isMobileContext()) {
			base = basePath;
		} else {
			base = router.baseroute
				? '/' + router.baseroute.split('/')[1] + '/'
				: '';
		}

		return (
			<div className="library-section-heading">
				<Menu
					getText={Collection.getSortOptionText}
					value={data.sortOn}
					title={getSectionTitle(section, data.sortOn)}
					options={sortOptions}
					onChange={onSortChange}
				/>
				{(section === 'courses' || section === 'admin') && (
					<div className="course-section-heading">
						{section === 'courses' ? (
							<AddButton section={section} />
						) : (
							<div />
						)}

						{!empty && this.showSeeAll() && (
							<LinkTo.Path
								to={
									section === 'admin'
										? base + 'library/admin-courses'
										: base + 'library/courses'
								}
								className="see-all"
							>
								See All
							</LinkTo.Path>
						)}
					</div>
				)}
				{section === 'archivedcourses' && (
					<div className="course-section-heading-date">{date}</div>
				)}
			</div>
		);
	}
}

export default decorate(SectionHeading, [
	Connectors.Any.connect({
		EnrolledCourses: 'courses',
		AdministeredCourses: 'admin',
		hasSearchTerm: 'hasSearchTerm',
	}),
]);

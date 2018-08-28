import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import CoursesContainer from '../containers/CoursesContainer';

import Store from './AdminCourseStore';


@Store.connect({upcomingCourses: 'upcomingAdminCourses', currentCourses: 'currentAdminCourses', archivedCourses: 'archivedAdminCourses', loading: 'loading', error: 'error'})
export default class AdminCourses extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		store: PropTypes.object,
		upcomingCourses: PropTypes.array,
		currentCourses: PropTypes.array,
		archivedCourses: PropTypes.array,
		children: PropTypes.node
	}

	render () {
		let {upcomingCourses, currentCourses, archivedCourses, loading} = this.props;

		return (
			<div className="courses-view">
				<div className="breadcrumb">
					<LinkTo.Name name="library-home" className="home-link">
						Home
					</LinkTo.Name>
					<div className="title">
						Administered Courses
					</div>
				</div>

				{upcomingCourses && upcomingCourses.length > 0 &&
					<CoursesContainer items={upcomingCourses} itemsType="upcoming" admin />
				}
				{currentCourses && currentCourses.length > 0 &&
					<CoursesContainer items={currentCourses} itemsType="current" admin />
				}
				{archivedCourses && archivedCourses.length > 0 &&
					<CoursesContainer items={archivedCourses} itemsType="archived" admin />
				}
				{!archivedCourses && !loading &&
					<a className="load-archived-button" onClick={this.loadArchived}>Load Archived</a>
				}
			</div>
		);
	}
}

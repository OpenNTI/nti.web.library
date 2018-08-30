import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import CoursesContainer from '../containers/CoursesContainer';

import Store from './CourseStore';


@Store.connect({upcomingCourses: 'upcomingCourses', currentCourses: 'currentCourses', archivedCourses: 'archivedCourses', loading: 'loading', loadArchived: 'loadArchived', error: 'error'})
export default class Courses extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		loadArchived: PropTypes.bool,
		store: PropTypes.object,
		upcomingCourses: PropTypes.array,
		currentCourses: PropTypes.array,
		archivedCourses: PropTypes.array,
		children: PropTypes.node
	}

	loadArchived = () => {
		this.props.store.loadArchivedCourses();
	}

	render () {
		let {upcomingCourses, currentCourses, archivedCourses, loading, loadArchived} = this.props;

		return (
			<div className="courses-view">
				<div className="breadcrumb">
					<LinkTo.Name name="library-home" className="home-link">
						Home
					</LinkTo.Name>
					<div className="title">
						Courses
					</div>

					<LinkTo.Path to="./catalog" className="add-courses-button">
						Add Courses
					</LinkTo.Path>
				</div>

				{loading ? (
					<Loading.Mask/>
				) : (
					<div>
						{upcomingCourses && upcomingCourses.length > 0 &&
							<CoursesContainer items={upcomingCourses} itemsType="upcoming" />
						}
						{currentCourses && currentCourses.length > 0 &&
							<CoursesContainer items={currentCourses} itemsType="current" />
						}
						{archivedCourses && archivedCourses.length > 0 &&
							<CoursesContainer items={archivedCourses} itemsType="archived" />
						}
						{!archivedCourses && (
							<div>
								{loadArchived ? (
									<Loading.Spinner/>
								) : (
									<a className="load-archived-button" onClick={this.loadArchived}>Load Archived</a>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

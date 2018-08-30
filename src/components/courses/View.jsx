import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';
import {LinkTo} from '@nti/web-routing';

import CoursesContainer from '../containers/CoursesContainer';

import Store from './CourseStore';


@Store.connect({upcomingCourses: 'upcomingCourses', currentCourses: 'currentCourses', archivedCourses: 'archivedCourses', loading: 'loading', loadArchived: 'loadArchived', searchTerm: 'searchTerm', error: 'error'})
export default class Courses extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		loadArchived: PropTypes.bool,
		store: PropTypes.object,
		upcomingCourses: PropTypes.array,
		currentCourses: PropTypes.array,
		archivedCourses: PropTypes.array,
		searchTerm: PropTypes.bool,
		children: PropTypes.node
	}

	loadArchived = () => {
		this.props.store.loadArchivedCourses();
	}

	render () {
		let {upcomingCourses, currentCourses, archivedCourses, loading, loadArchived, searchTerm} = this.props;

		const noUpcoming = upcomingCourses && upcomingCourses.length === 0;
		const noCurrent = currentCourses && currentCourses.length === 0;
		const noArchived = archivedCourses && archivedCourses.length === 0;
		const emptySearch = searchTerm && noUpcoming && noCurrent && noArchived;

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
						{emptySearch ? (
							<div className="no-results">No courses found.</div>
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
				)}
			</div>
		);
	}
}

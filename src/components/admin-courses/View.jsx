import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Layouts} from '@nti/web-commons';
import {Input, searchable} from '@nti/web-search';
import {LinkTo} from '@nti/web-routing';
import {scoped} from '@nti/lib-locale';

import CoursesContainer from '../containers/CoursesContainer';

import Store from './AdminCourseStore';

const {Responsive} = Layouts;

const t = scoped('library.components.AdminCourses', {
	admin: 'Administered Courses',
	empty: 'No Administered Courses found.'
});

export default
@searchable()
@Store.connect({upcomingCourses: 'upcomingCourses', currentCourses: 'currentCourses', archivedCourses: 'archivedCourses', loading: 'loading', loadArchived: 'loadArchived', hasSearchTerm: 'hasSearchTerm', error: 'error'})
class AdminCourses extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		loadArchived: PropTypes.bool,
		store: PropTypes.object,
		upcomingCourses: PropTypes.array,
		currentCourses: PropTypes.array,
		archivedCourses: PropTypes.array,
		hasSearchTerm: PropTypes.bool,
		children: PropTypes.node
	}

	renderSearchBar () {
		return (
			<div className="search-container">
				<Input />
				<i className="icon-search" />
			</div>
		);
	}

	loadArchived = () => {
		this.props.store.loadArchivedCourses();
	}

	render () {
		let {upcomingCourses, currentCourses, archivedCourses, loading, loadArchived, hasSearchTerm} = this.props;

		const noUpcoming = upcomingCourses && upcomingCourses.length === 0;
		const noCurrent = currentCourses && currentCourses.length === 0;
		const noArchived = archivedCourses && archivedCourses.length === 0;
		const emptySearch = hasSearchTerm && noUpcoming && noCurrent && noArchived;

		return (
			<div className="courses-view">
				<div className="breadcrumb">
					<LinkTo.Name name="library-home" className="home-link">
						Home
					</LinkTo.Name>
					<div className="title">
						{t('admin')}
					</div>
				</div>

				{loading ? (
					<Loading.Mask/>
				) : (
					<div>
						<Responsive.Item query={Responsive.isMobileContext} render={this.renderSearchBar} />

						{emptySearch ? (
							<div className="no-results">{t('empty')}</div>
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
									<div className="loading-archived">
										{loadArchived ? (
											<Loading.Spinner />
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

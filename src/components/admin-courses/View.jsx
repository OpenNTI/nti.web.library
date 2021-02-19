import './View.scss';
import React from 'react';
// import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {getService} from '@nti/web-client';
import {Hooks, Loading, Page} from '@nti/web-commons';
import {Collection as CourseCollection} from '@nti/web-course';
import {LinkTo} from '@nti/web-routing';

import SectionTitle from '../SectionTitle';

const {useResolver} = Hooks;
const {isPending, isResolved, isErrored} = useResolver;

const t = scoped('library.components.AdminCourses', {
	admin: 'Administered Courses',
	empty: 'No Administered Courses found.'
});

export default function AdminCourses () {
	const resolver = useResolver(async () => {
		const service = await getService();

		return service.getCollection('AdministeredCourses', 'Courses');
	}, []);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const collection = isResolved(resolver) ? resolver : null;

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
			<Loading.Placeholder loading={loading} fallback={<Loading.Spinner.Large />}>
				{error && (<Page.Content.Error error={error} />)}
				{collection && (<CourseCollection.Page collection={collection} getSectionTitle={SectionTitle.getTitle} />)}
			</Loading.Placeholder>
		</div>
	);
}



// class AdminCourses extends React.Component {
// 	static propTypes = {
// 		loading: PropTypes.bool,
// 		loadArchived: PropTypes.bool,
// 		store: PropTypes.object,
// 		upcomingCourses: PropTypes.array,
// 		currentCourses: PropTypes.array,
// 		archivedCourses: PropTypes.array,
// 		hasSearchTerm: PropTypes.bool,
// 		children: PropTypes.node
// 	}

// 	loadArchived = () => {
// 		this.props.store.loadArchivedCourses();
// 	}

// 	onModificationUpcoming = () => {
// 		this.props.store.reloadUpcoming();
// 	};

// 	onModificationCurrent= () => {
// 		this.props.store.reloadCurrent();
// 	};

// 	render () {
// 		let {upcomingCourses, currentCourses, archivedCourses, loading, loadArchived, hasSearchTerm} = this.props;

// 		const noUpcoming = upcomingCourses && upcomingCourses.length === 0;
// 		const noCurrent = currentCourses && currentCourses.length === 0;
// 		const noArchived = archivedCourses && archivedCourses.length === 0;
// 		const emptySearch = hasSearchTerm && noUpcoming && noCurrent && noArchived;

// 		return (
// 			<div className="courses-view">
// 				<div className="breadcrumb">
// 					<LinkTo.Name name="library-home" className="home-link">
// 						Home
// 					</LinkTo.Name>
// 					<div className="title">
// 						{t('admin')}
// 					</div>
// 				</div>

// 				{loading ? (
// 					<Loading.Mask/>
// 				) : (
// 					<>
// 						{emptySearch ? (
// 							<div className="no-results">{t('empty')}</div>
// 						) : (
// 							<div>
// 								{upcomingCourses && upcomingCourses.length > 0 &&
// 									<CoursesContainer items={upcomingCourses} itemsType="upcoming" onModification={this.onModificationUpcoming} />
// 								}
// 								{currentCourses && currentCourses.length > 0 &&
// 									<CoursesContainer items={currentCourses} itemsType="current" onModification={this.onModificationCurrent} />
// 								}
// 								{archivedCourses && archivedCourses.length > 0 &&
// 									<CoursesContainer items={archivedCourses} itemsType="archived" onModification={this.loadArchived} />
// 								}
// 								{!archivedCourses && (
// 									<div className="loading-archived">
// 										{loadArchived ? (
// 											<Loading.Spinner />
// 										) : (
// 											<a className="load-archived-button" onClick={this.loadArchived}>Load Archived</a>
// 										)}
// 									</div>
// 								)}
// 							</div>
// 						)}
// 					</>
// 				)}
// 			</div>
// 		);
// 	}
// }

// export default decorate(AdminCourses, [
// 	searchable(),
// 	contextual(t('admin')),
// 	Store.connect({
// 		upcomingCourses: 'upcomingCourses',
// 		currentCourses: 'currentCourses',
// 		archivedCourses: 'archivedCourses',
// 		loading: 'loading',
// 		loadArchived: 'loadArchived',
// 		hasSearchTerm: 'hasSearchTerm',
// 		error: 'error'
// 	}),
// ]);

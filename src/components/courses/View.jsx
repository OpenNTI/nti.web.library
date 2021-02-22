import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Loading, Hooks, Page } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';
import { LinkTo, Router } from '@nti/web-routing';

import SectionTitle from '../SectionTitle';

const { useResolver } = Hooks;
const { isPending, isResolved, isErrored } = useResolver;

const t = scoped('library.components.Courses', {
	courses: 'Courses',
	empty: 'No courses found.',
	add: 'Add Courses',
});

EnrolledCourses.propTypes = {
	basePath: PropTypes.string,
};
function EnrolledCourses({ basePath }) {
	const router = Router.useRouter();
	const baseroute = basePath ?? router.baseroute.replace('library', '');

	const resolver = useResolver(async () => {
		const service = await getService();

		return service.getCollection('EnrolledCourses', 'Courses');
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
				<div className="title">{t('courses')}</div>

				<LinkTo.Path
					to={baseroute + '/catalog'}
					className="add-courses-button"
				>
					{t('add')}
				</LinkTo.Path>
			</div>
			<Loading.Placeholder
				loading={loading}
				fallback={<Loading.Spinner.Large />}
			>
				{error && <Page.Content.Error error={error} />}
				{collection && (
					<CourseCollection.Page
						collection={collection}
						getSectionTitle={SectionTitle.getTitle}
					/>
				)}
			</Loading.Placeholder>
		</div>
	);
}

export default class EnrolledCoursesWrapper extends React.Component {
	static contextTypes = {
		basePath: PropTypes.string,
	};

	render() {
		return (
			<EnrolledCourses basePath={this.context.basePath} {...this.props} />
		);
	}
}

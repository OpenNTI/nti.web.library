import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Loading, Hooks, Page } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';
import { Router } from '@nti/web-routing';

import SectionTitle from '../SectionTitle';

import {
	Container,
	Toolbar,
	Breadcrumbs,
	HomeCrumb,
	CurrentSectionTitleCrumb,
	AddCourseLink,
} from './parts';

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
		<Container>
			<Toolbar>
				<Breadcrumbs>
					<HomeCrumb>Home</HomeCrumb>
					<CurrentSectionTitleCrumb>
						{t('courses')}
					</CurrentSectionTitleCrumb>
				</Breadcrumbs>

				<AddCourseLink
					to={baseroute + '/catalog'}
					data-testid="add-courses-button"
				>
					{t('add')}
				</AddCourseLink>
			</Toolbar>
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
		</Container>
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

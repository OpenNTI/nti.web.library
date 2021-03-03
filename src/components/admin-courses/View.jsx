import React from 'react';
// import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Hooks, Loading, Page } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';

import SectionTitle from '../SectionTitle';
import {
	Container,
	Toolbar,
	Breadcrumbs,
	HomeCrumb,
	CurrentSectionTitleCrumb,
} from '../courses/parts';

const { Grid } = CourseCollection;
const { useResolver } = Hooks;
const { isPending, isResolved, isErrored } = useResolver;

const t = scoped('library.components.AdminCourses', {
	admin: 'Administered Courses',
	empty: 'No Administered Courses found.',
});

export default function AdminCourses() {
	const resolver = useResolver(async () => {
		const service = await getService();

		return service.getCollection('AdministeredCourses', 'Courses');
	}, []);

	const loading = isPending(resolver);
	const error = isErrored(resolver) ? resolver : null;
	const collection = isResolved(resolver) ? resolver : null;

	return (
		<Container>
			<Grid singleColumn>
				<Toolbar>
					<Breadcrumbs>
						<HomeCrumb>Home</HomeCrumb>
						<CurrentSectionTitleCrumb>
							{t('admin')}
						</CurrentSectionTitleCrumb>
					</Breadcrumbs>
				</Toolbar>
			</Grid>
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

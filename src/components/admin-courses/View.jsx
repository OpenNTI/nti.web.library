import './View.scss';
import React from 'react';
// import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Hooks, Loading, Page } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';
import { LinkTo } from '@nti/web-routing';

import SectionTitle from '../SectionTitle';

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
		<div className="courses-view">
			<div className="breadcrumb">
				<LinkTo.Name name="library-home" className="home-link">
					Home
				</LinkTo.Name>
				<div className="title">{t('admin')}</div>
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

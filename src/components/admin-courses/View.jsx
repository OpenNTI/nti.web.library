import React from 'react';
// import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { getService } from '@nti/web-client';
import { Hooks, Loading, Page } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';
import { LinkTo } from '@nti/web-routing';

import SectionTitle from '../SectionTitle';
import styles from '../courses/View.css';

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
		<div className={styles.coursesView}>
			<Grid singleColumn>
				<div className={styles.breadcrumb}>
					<LinkTo.Name
						name="library-home"
						className={styles.homeLink}
					>
						Home
					</LinkTo.Name>
					<div className={styles.title}>{t('admin')}</div>
				</div>
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
		</div>
	);
}

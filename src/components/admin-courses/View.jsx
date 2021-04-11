import React from 'react';

// import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { User, Menu } from '@nti/web-commons';
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
const { usePrefs } = User;

const t = scoped('library.components.AdminCourses', {
	admin: 'Administered Courses',
	empty: 'No Administered Courses found.',
});

const FAVORITES = 'favorites';

const courseSortOptions = [
	FAVORITES,
	'createdTime',
	'provideruniqueid',
	'lastSeenTime',
	'title',
];

export default function AdminCourses() {
	const prefs = usePrefs(['librarySort']);
	const sortOn = prefs?.get('librarySort') ?? courseSortOptions[0];

	const onChange = React.useCallback(
		sort => prefs?.set('librarySort', sort),
		[prefs]
	);

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
			<CourseCollection.Page
				collection="AdministeredCourses"
				sortOn={sortOn}
				getSectionTitle={SectionTitle.getTitle}
			>
				<Menu
					slot="controls"
					options={courseSortOptions}
					value={sortOn}
					onChange={onChange}
				/>
			</CourseCollection.Page>
		</Container>
	);
}

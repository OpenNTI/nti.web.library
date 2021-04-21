import React from 'react';

import { Models } from '@nti/lib-interfaces';
import { scoped } from '@nti/lib-locale';
import { User, Menu } from '@nti/web-commons';
import { CollectionSortable as CourseCollection } from '@nti/web-course';

import SectionTitle from '../SectionTitle';
import { getPrefsSortKey } from '../homepage/Store';
import {
	Container,
	Toolbar,
	Breadcrumbs,
	HomeCrumb,
	CurrentSectionTitleCrumb,
} from '../courses/parts';

const prefsSortKey = getPrefsSortKey('AdministeredCourses');
const { sortOptions } = Models.library.AdministeredCoursesDataSource;

const { Grid } = CourseCollection;
const { usePreferences } = User;

const t = scoped('library.components.AdminCourses', {
	admin: 'Administered Courses',
	empty: 'No Administered Courses found.',
});

export default function AdminCourses() {
	const prefs = usePreferences([prefsSortKey]);
	const sortPref = prefs?.get(prefsSortKey)?.sortOn;
	const sortOn = sortOptions.includes(sortPref)
		? sortPref
		: sortOptions?.[0] || '';

	const onChange = React.useCallback(
		sort => prefs?.set(prefsSortKey, { sortOn: sort }),
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
				<Menu.Select
					getText={CourseCollection.getSortOptionText}
					slot="controls"
					options={sortOptions}
					value={sortOn}
					onChange={onChange}
				/>
			</CourseCollection.Page>
		</Container>
	);
}

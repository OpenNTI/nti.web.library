import React from 'react';
import PropTypes from 'prop-types';

import { Models } from '@nti/lib-interfaces';
import { User, Menu } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
import { CollectionSortable as CourseCollection } from '@nti/web-course';
import { Router } from '@nti/web-routing';

import SectionTitle from '../SectionTitle';
import { getPrefsSortKey } from '../homepage/Store';

import {
	Container,
	Toolbar,
	Breadcrumbs,
	HomeCrumb,
	CurrentSectionTitleCrumb,
	AddCourseLink,
} from './parts';
const prefsSortKey = getPrefsSortKey('EnrolledCourses');
const { sortOptions } = Models.library.EnrolledCoursesDataSource;

const { usePreferences } = User;

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
	const prefs = usePreferences([prefsSortKey]);
	const sortOn = prefs?.get(prefsSortKey)?.sortOn || sortOptions?.[0] || '';

	const onChange = React.useCallback(
		sort => prefs?.set(prefsSortKey, { sortOn: sort }),
		[prefs]
	);

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
			<CourseCollection.Page
				collection="EnrolledCourses"
				sortOn={sortOn}
				getSectionTitle={SectionTitle.getTitle}
			>
				<Menu.Select
					slot="controls"
					getText={CourseCollection.getSortOptionText}
					options={sortOptions}
					value={sortOn}
					onChange={onChange}
				/>
			</CourseCollection.Page>
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

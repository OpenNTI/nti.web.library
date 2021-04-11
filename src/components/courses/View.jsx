import React from 'react';
import PropTypes from 'prop-types';

import { User, Menu } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';
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

const { usePreferences } = User;

const t = scoped('library.components.Courses', {
	courses: 'Courses',
	empty: 'No courses found.',
	add: 'Add Courses',
});

const FAVORITES = 'favorites';

const courseSortOptions = [
	FAVORITES,
	'createdTime',
	'provideruniqueid',
	'lastSeenTime',
	'title',
];

EnrolledCourses.propTypes = {
	basePath: PropTypes.string,
};
function EnrolledCourses({ basePath }) {
	const router = Router.useRouter();
	const baseroute = basePath ?? router.baseroute.replace('library', '');
	const prefs = usePreferences(['librarySort']);
	const sortOn = prefs?.get('librarySort') ?? courseSortOptions[0];
	const onChange = React.useCallback(
		sort => prefs?.set('librarySort', sort),
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

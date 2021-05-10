import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { User, Menu } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';
import { Router } from '@nti/web-routing';

import SectionTitle from '../SectionTitle';
import { getPrefsSortKey } from '../homepage/Store';
import {
	COLLECTION_NAMES as COLLECTIONS,
	COLLECTION_NAMES,
} from '../constants';
import { getSortOptions } from '../utils/get-sort-options';

import {
	Container,
	Toolbar,
	Breadcrumbs,
	HomeCrumb,
	CurrentSectionTitleCrumb,
	AddCourseLink,
} from './parts';

const { Grid } = CourseCollection;
const { usePreference } = User;

const tx = scoped(`library.components`, {
	[COLLECTION_NAMES.enrolledCourses]: {
		courses: 'Courses',
		empty: 'No Courses found.',
		add: 'Add Courses',
	},
	[COLLECTION_NAMES.administeredCourses]: {
		courses: 'Administered Courses',
		empty: 'No Administered Courses found.',
	},
});

const getLocalizer = collectionName => s => tx(`${collectionName}.${s}`);

const Header = ({ children, getText = x => x }) => (
	<Grid singleColumn>
		<Toolbar>
			<Breadcrumbs>
				<HomeCrumb>Home</HomeCrumb>
				<CurrentSectionTitleCrumb>
					{getText('courses')}
				</CurrentSectionTitleCrumb>
			</Breadcrumbs>
			{children}
		</Toolbar>
	</Grid>
);

export function CourseListCmp({
	collection = COLLECTIONS.enrolledCourses,
	basePath,
}) {
	const t = getLocalizer(collection);
	const router = Router.useRouter();
	const baseroute = basePath ?? router.baseroute.replace('library', '');
	const sortOptions = getSortOptions(collection);
	const prefsSortKey = getPrefsSortKey(collection);
	const [prefs, setPref] = usePreference(prefsSortKey);
	const sortPref = prefs?.sortOn;
	const sortOn = sortOptions.includes(sortPref)
		? sortPref
		: sortOptions?.[0] || '';

	const canAdd = collection === COLLECTIONS.enrolledCourses;

	const onChange = React.useCallback(sort => setPref({ sortOn: sort }), [
		prefs,
		setPref,
	]);

	return (
		<Container>
			<Header getText={t}>
				{canAdd && (
					<AddCourseLink
						to={baseroute + '/catalog'}
						data-testid="add-courses-button"
					>
						{t('add')}
					</AddCourseLink>
				)}
			</Header>
			<CourseCollection.Page
				collection={collection}
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

export class CourseList extends React.Component {
	static contextTypes = {
		basePath: PropTypes.string,
	};

	render() {
		return (
			<CourseListCmp basePath={this.context.basePath} {...this.props} />
		);
	}
}

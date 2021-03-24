import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Loading, Layouts } from '@nti/web-commons';
import { searchable, contextual } from '@nti/web-search';
import { scoped } from '@nti/lib-locale';
import { Collection } from '@nti/web-course';

import AdminToolbar from '../AdminToolbar';
import Communities from '../containers/Communities';
import Courses from '../containers/CoursesContainer';
import Books from '../containers/BooksContainer';

import HomePageStore from './HomeStore';

const { Responsive } = Layouts;
const { Grid } = Collection;

const FullWidth = styled.div`
	grid-column: full;

	/* safari 13 bug doesn't know where "full" starts */
	grid-column-start: 1;
`;

const t = scoped('library.components.Home', {
	home: 'Home',
});

class Home extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		store: PropTypes.object,
		courses: PropTypes.array,
		administeredCourses: PropTypes.array,
		books: PropTypes.array,
		communities: PropTypes.array,
		children: PropTypes.node,
		admin: PropTypes.bool,
		hasCatalog: PropTypes.bool,
		hasSearchTerm: PropTypes.bool,
		onSortChange: PropTypes.func,
	};

	onModificationCourse = () => {
		this.props.store.reloadCourseFavorites();
	};

	onModificationAdmin = () => {
		this.props.store.reloadAdminFavorites();
	};

	render() {
		let {
			admin,
			hasCatalog,
			courses,
			administeredCourses,
			books,
			communities,
			hasSearchTerm,
			loading,
			store,
			onSortChange,
		} = this.props;

		const hasCommunities = communities?.length > 0;
		const hasCourses = courses?.length > 0;
		const hasAdminCourses = administeredCourses?.length > 0;
		const hasBooks = books?.length > 0;
		const emptySearch =
			hasSearchTerm &&
			!hasCommunities &&
			!hasCourses &&
			!hasAdminCourses &&
			!hasBooks;

		const canShowCoursesSection = hasCourses || hasCatalog;

		return (
			<div className="library-view">
				{loading ? (
					<Loading.Mask />
				) : (
					<>
						{admin && (
							<Grid singleColumn>
								<Responsive.Item
									query={Responsive.isWebappContext}
									component={AdminToolbar}
									store={store}
								/>
							</Grid>
						)}

						{emptySearch ? (
							<Grid singleColumn className="no-results">
								<FullWidth>No results found.</FullWidth>
							</Grid>
						) : (
							<>
								{hasCommunities && (
									<Communities items={communities} />
								)}

								{((!hasSearchTerm && canShowCoursesSection) ||
									(hasSearchTerm && hasCourses)) && (
									<Courses
										items={courses}
										onSortChange={(sortOn, sortDirection) =>
											onSortChange(
												'courses',
												sortOn,
												sortDirection
											)
										}
										onModification={
											this.onModificationCourse
										}
									/>
								)}

								{hasAdminCourses && (
									<Courses
										admin
										items={administeredCourses}
										onSortChange={(sortOn, sortDirection) =>
											onSortChange(
												'administeredCourses',
												sortOn,
												sortDirection
											)
										}
										onModification={
											this.onModificationAdmin
										}
									/>
								)}

								{hasBooks && <Books items={books} />}
							</>
						)}
					</>
				)}
			</div>
		);
	}
}

export default decorate(Home, [
	searchable(),
	contextual(t('home')),
	HomePageStore.connect({
		admin: 'admin',
		hasCatalog: 'hasCatalog',
		courses: 'courses',
		administeredCourses: 'administeredCourses',
		books: 'books',
		communities: 'communities',
		loading: 'loading',
		hasSearchTerm: 'hasSearchTerm',
		error: 'error',
		onSortChange: 'onSortChange',
	}),
]);

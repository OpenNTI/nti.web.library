import './Home.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Loading, Layouts } from '@nti/web-commons';
import { searchable, contextual } from '@nti/web-search';
import { scoped } from '@nti/lib-locale';
import { CollectionSortable as Collection } from '@nti/web-course';
import { useStoreValue } from '@nti/lib-store';

import AdminToolbar from '../AdminToolbar';
import Communities from '../containers/Communities';
import Courses from '../containers/CoursesContainer';
import Books from '../containers/BooksContainer';

import { default as HomePageStore, KEYS } from './HomeStore';

const { Responsive } = Layouts;
const { Grid } = Collection;

const courseStorePredicate = collection => store =>
	store?.binding?.collection === collection;

const enrolledStorePredicate = courseStorePredicate(KEYS.courses);
const adminStorePredicate = courseStorePredicate(KEYS.administeredCourses);
const hasItems = groups => (groups || []).some(g => g?.Items?.length > 0);

const FullWidth = styled.div`
	grid-column: full;

	/* safari 13 bug doesn't know where "full" starts */
	grid-column-start: 1;
`;

const t = scoped('library.components.Home', {
	home: 'Home',
});

const CollectionDataPropType = PropTypes.shape({
	items: PropTypes.array,
	total: PropTypes.number,
	sortOn: PropTypes.string,
	sortDirection: PropTypes.string,
});

HomeCmp.propTypes = {
	loading: PropTypes.bool,
	store: PropTypes.object,
	EnrolledCourses: CollectionDataPropType,
	AdministeredCourses: CollectionDataPropType,
	books: CollectionDataPropType,
	communities: PropTypes.array,
	children: PropTypes.node,
	admin: PropTypes.bool,
	hasCatalog: PropTypes.bool,
	hasSearchTerm: PropTypes.bool,
	onSortChange: PropTypes.func,
	searchTerm: PropTypes.string,
};

function HomeCmp(props) {
	const onModificationCourse = React.useCallback(
		() => props.store.reload(KEYS.courses),
		[props.store]
	);
	const onModificationAdmin = React.useCallback(
		() => props.store.reload(KEYS.administeredCourses),
		[props.store]
	);

	let {
		admin,
		hasCatalog,
		// EnrolledCourses: courses,
		// AdministeredCourses: administeredCourses,
		books,
		communities,
		hasSearchTerm,
		loading,
		store,
		onSortChange,
	} = props;

	const { groups: enrolledGroups, hasMore: enrolledHasMore } = useStoreValue(
		enrolledStorePredicate
	);
	const { groups: adminGroups, hasMore: adminHasMore } = useStoreValue(
		adminStorePredicate
	);

	const hasCommunities = communities?.items?.length > 0;
	const hasCourses = hasItems(enrolledGroups);
	const hasAdminCourses = hasItems(adminGroups);
	const hasBooks = books?.items?.length > 0;
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
									items={enrolledGroups?.[0]?.Items} // from web.course collection store
									hasMore={enrolledHasMore}
									sortOptions={store.getSortOptions(
										KEYS.courses
									)}
									onSortChange={(sortOn, sortDirection) =>
										onSortChange(
											KEYS.courses,
											sortOn,
											sortDirection
										)
									}
									onModification={onModificationCourse}
								/>
							)}

							{hasAdminCourses && (
								<Courses
									admin
									hasMore={adminHasMore}
									items={adminGroups?.[0]?.Items} // from web.course collection store
									sortOptions={store.getSortOptions(
										KEYS.administeredCourses
									)}
									onSortChange={(sortOn, sortDirection) =>
										onSortChange(
											KEYS.administeredCourses,
											sortOn,
											sortDirection
										)
									}
									onModification={onModificationAdmin}
								/>
							)}

							{/* {((!hasSearchTerm && canShowCoursesSection) ||
								(hasSearchTerm && hasCourses)) && (
								<Courses
									items={courses?.items}
									sortOptions={store.getSortOptions(
										KEYS.courses
									)}
									onSortChange={(sortOn, sortDirection) =>
										onSortChange(
											KEYS.courses,
											sortOn,
											sortDirection
										)
									}
									onModification={onModificationCourse}
								/>
							)}
							*/}

							{hasBooks && <Books items={books?.items} />}
						</>
					)}
				</>
			)}
		</div>
	);
}

// Connect to the nti/web.course Store to load enrolled and administered courses.
// This comes before the HomePageStore connection (below) because it uses props
// provided by the HomePageStore for sort and search.
const WithCourses = [KEYS.administeredCourses, KEYS.courses].reduce(
	(Cmp, collection) => {
		return Collection.Store.compose(Cmp, {
			deriveBindingFromProps: ({ [collection]: data }) => {
				return {
					collection,
					sortOn: data?.sortOn,
					sortDirection: data?.sortDirection,
					batchSize: data?.batchSize,
				};
			},
		});
	},
	HomeCmp
);

export const Home = decorate(WithCourses, [
	searchable(),
	contextual(t('home')),
	HomePageStore.connect({
		admin: 'admin',
		hasCatalog: 'hasCatalog',
		[KEYS.courses]: 'EnrolledCourses',
		[KEYS.administeredCourses]: 'AdministeredCourses',
		[KEYS.books]: 'books',
		[KEYS.communities]: 'communities',
		loading: 'loading',
		hasSearchTerm: 'hasSearchTerm',
		error: 'error',
		onSortChange: 'onSortChange',
	}),
]);
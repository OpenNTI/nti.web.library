import React from 'react';
import PropTypes from 'prop-types';
import {Loading, Layouts} from '@nti/web-commons';
import {searchable, contextual} from '@nti/web-search';
import {scoped} from '@nti/lib-locale';

import AdminToolbar from '../AdminToolbar';
import Communities from '../containers/Communities';
import Courses from '../containers/CoursesContainer';
import Books from '../containers/BooksContainer';

import HomePageStore from './HomeStore';

const {Responsive} = Layouts;

const t = scoped('library.components.Home', {
	home: 'Home'
});


export default
@searchable()
@contextual(t('home'))
@HomePageStore.connect({admin: 'admin', hasCatalog: 'hasCatalog', courses: 'courses', administeredCourses: 'administeredCourses', books: 'books', communities: 'communities', loading: 'loading', hasSearchTerm: 'hasSearchTerm', error: 'error'})
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
		hasSearchTerm: PropTypes.bool
	}

	onModificationCourse = () => {
		this.props.store.reloadCourseFavorites();
	};

	onModificationAdmin = () => {
		this.props.store.reloadAdminFavorites();
	};

	render () {
		let {admin, hasCatalog, courses, administeredCourses, books, communities, hasSearchTerm, loading, store} = this.props;

		const noCommunities = !communities || communities.length === 0;
		const noCourses = !courses || courses.length === 0;
		const noAdminCourses = !administeredCourses || administeredCourses.length === 0;
		const noBooks = !books || books.length === 0;
		const emptySearch = hasSearchTerm && noCommunities && noCourses && noAdminCourses && noBooks;

		return (
			<div className="library-view">
				{loading ? (
					<Loading.Mask/>
				) : (
					<div>
						{admin &&
							<Responsive.Item query={Responsive.isWebappContext} component={AdminToolbar} store={store} />
						}

						{emptySearch ? (
							<div className="no-results">No results found.</div>
						) : (
							<div>
								{!noCommunities &&
									<Communities items={communities} />
								}

								{(!hasSearchTerm && (!noCourses || hasCatalog)) &&
									<Courses items={courses} onModification={this.onModificationCourse}/>
								}

								{!noAdminCourses &&
									<Courses admin items={administeredCourses} onModification={this.onModificationAdmin} />
								}

								{!noBooks &&
									<Books items={books} />
								}
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

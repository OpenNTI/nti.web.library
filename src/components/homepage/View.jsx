import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';

import AdminToolbar from '../AdminToolbar';
import Communities from '../containers/Communities';
import Courses from '../containers/CoursesContainer';
import Books from '../containers/BooksContainer';

import HomePageStore from './HomeStore';

@HomePageStore.connect({admin: 'admin', courses: 'courses', administeredCourses: 'administeredCourses', 'books': 'books', 'communities': 'communities', loading: 'loading', searchTerm: 'searchTerm', error: 'error'})
export default class Home extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		store: PropTypes.object,
		courses: PropTypes.array,
		administeredCourses: PropTypes.array,
		books: PropTypes.array,
		communities: PropTypes.array,
		children: PropTypes.node,
		admin: PropTypes.bool,
		searchTerm: PropTypes.bool
	}

	render () {
		let {admin, courses, administeredCourses, books, communities, searchTerm, loading} = this.props;

		const noCommunities = communities && communities.length === 0;
		const noCourses = courses && courses.length === 0;
		const noAdminCourses = administeredCourses && administeredCourses.length === 0;
		const noBooks = books && books.length === 0;
		const emptySearch = searchTerm && noCommunities && noCourses && noAdminCourses && noBooks;

		return (
			<div className="library-view">
				{loading ? (
					<Loading.Mask/>
				) : (
					<div>
						{admin &&
							<AdminToolbar />
						}

						{emptySearch ? (
							<div className="no-results">No results found.</div>
						) : (
							<div>
								{!noCommunities &&
									<Communities items={communities} />
								}

								{((courses && !searchTerm) || !noCourses) &&
									<Courses items={courses} />
								}

								{!noAdminCourses &&
									<Courses admin items={administeredCourses} />
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

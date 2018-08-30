import React from 'react';
import PropTypes from 'prop-types';
import {Loading} from '@nti/web-commons';

import AdminToolbar from '../AdminToolbar';
import Communities from '../containers/Communities';
import Courses from '../containers/CoursesContainer';
import Books from '../containers/BooksContainer';

import HomePageStore from './HomeStore';

@HomePageStore.connect({admin: 'admin', courses: 'courses', administeredCourses: 'administeredCourses', 'books': 'books', 'communities': 'communities', loading: 'loading', error: 'error'})
export default class Home extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		store: PropTypes.object,
		courses: PropTypes.array,
		administeredCourses: PropTypes.array,
		books: PropTypes.array,
		communities: PropTypes.array,
		children: PropTypes.node,
		admin: PropTypes.bool
	}

	render () {
		let {admin, courses, administeredCourses, books, communities, loading} = this.props;

		return (
			<div className="library-view">
				{loading ? (
					<Loading.Mask/>
				) : (
					<div>
						{admin &&
							<AdminToolbar />
						}

						{communities && communities.length > 0 &&
							<Communities items={communities} />
						}

						{courses &&
							<Courses items={courses} />
						}

						{administeredCourses && administeredCourses.length > 0 &&
							<Courses admin items={administeredCourses} />
						}

						{books && books.length > 0 &&
							<Books items={books} />
						}
					</div>
				)}
			</div>
		);
	}
}

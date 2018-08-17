import React from 'react';
import PropTypes from 'prop-types';

import Store from '../Store';

import AdminToolbar from './AdminToolbar';
import Communities from './containers/Communities';
import Courses from './containers/Courses';
import Books from './containers/Books';

@Store.connect({admin: 'admin', courses: 'courses', administeredCourses: 'administeredCourses', 'books': 'books', 'communities': 'communities', loading: 'loading', error: 'error'})
export default  class LibraryView extends React.Component {
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

	get store () {
		return this.props.store;
	}

	componentDidMount () {
		this.store.loadLibrary();
	}

	render () {
		let {admin, courses, administeredCourses, books, communities} = this.props;

		return (
			<div className="library-view">
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
		);
	}
}

import React from 'react';
import cx from 'classnames';

import { Router, Route } from '@nti/web-routing';
import { Layouts, Theme } from '@nti/web-commons';

import { Home } from './homepage';
import { Courses as EnrolledCourses } from './courses';
import { AdminCourses } from './admin-courses';

const { Responsive } = Layouts;

const Routes = Responsive.isMobileContext()
	? Router.for([
			Route({
				path: '/mobile/library/courses',
				component: EnrolledCourses,
				name: 'library-courses',
			}),
			Route({
				path: '/mobile/library/admin-courses',
				component: AdminCourses,
				name: 'library-admin-courses',
			}),
			Route({
				path: '/mobile/library',
				component: Home,
				name: 'library-home',
			}),
	  ])
	: Router.for([
			Route({
				path: '/courses',
				component: EnrolledCourses,
				name: 'library-courses',
			}),
			Route({
				path: '/admin-courses',
				component: AdminCourses,
				name: 'library-admin-courses',
			}),
			Route({ path: '/', component: Home, name: 'library-home' }),
	  ]);

export default React.forwardRef(function LibraryView(props, ref) {
	const theme = Theme.useTheme();
	const libraryTheme = theme.scope('library');
	const background = libraryTheme.background;
	const className =
		background === 'light'
			? 'library-light-background'
			: 'library-dark-background';

	return (
		<Theme.Scope scope="library">
			<section ref={ref} className={cx('library-view', className)}>
				<Routes {...props} />
			</section>
		</Theme.Scope>
	);
});

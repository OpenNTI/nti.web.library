import React from 'react';
import cx from 'classnames';

import { Router, Route } from '@nti/web-routing';
import { Layouts, Theme } from '@nti/web-commons';

import { COLLECTION_NAMES as COLLECTIONS } from './constants';
import { Home } from './homepage';
import { CourseList } from './courses/CourseList';

const { Responsive } = Layouts;
const EnrolledCourses = props => (
	<CourseList collection={COLLECTIONS.enrolledCourses} {...props} />
);
const AdminCourses = props => (
	<CourseList collection={COLLECTIONS.administeredCourses} {...props} />
);

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

const Wrapper = styled('section')`
	&.dark {
		--text-color-primary: white;
		--text-color-nav-link: var(--text-color-primary);
	}
`;

export default React.forwardRef(function LibraryView(props, ref) {
	const theme = Theme.useTheme();
	const libraryTheme = theme.scope('library');
	const background = libraryTheme.background;
	const isDark = background !== 'light';

	const className = isDark
		? 'library-dark-background'
		: 'library-light-background';

	return (
		<Theme.Scope scope="library">
			<Wrapper
				dark={isDark}
				ref={ref}
				className={cx('library-view', className)}
			>
				<Routes {...props} />
			</Wrapper>
		</Theme.Scope>
	);
});

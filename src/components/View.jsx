import {Router, Route} from '@nti/web-routing';
import {Layouts} from '@nti/web-commons';

import {Home} from './homepage';
import {Courses} from './courses';
import {AdminCourses} from './admin-courses';

const {Responsive} = Layouts;

export default Responsive.isMobileContext() ? (
	Router.for([
		Route({path: '/mobile/library/courses', component: Courses, name: 'library-courses'}),
		Route({path: '/mobile/library/admin-courses', component: AdminCourses, name: 'library-admin-courses'}),
		Route({path: '/mobile/library', component: Home, name: 'library-home'})
	])
) : (
	Router.for([
		Route({path: '/courses', component: Courses, name: 'library-courses'}),
		Route({path: '/admin-courses', component: AdminCourses, name: 'library-admin-courses'}),
		Route({path: '/', component: Home, name: 'library-home'})
	])
);

import {Router, Route} from '@nti/web-routing';

import {Home} from './homepage';
import {Courses} from './courses';
import {AdminCourses} from './admin-courses';

export default Router.for([
	Route({path: '/courses', component: Courses, name: 'library-courses'}),
	Route({path: '/mobile/library/courses', component: Courses, name: 'library-courses'}),
	Route({path: '/admin-courses', component: AdminCourses, name: 'library-admin-courses'}),
	Route({path: '/mobile/library/admin-courses', component: Courses, name: 'library-courses'}),
	Route({path: '/', component: Home, name: 'library-home'}),
	Route({path: '/mobile/library', component: Home, name: 'library-home-mobile'})
]);

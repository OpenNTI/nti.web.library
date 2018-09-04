import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

import {CreateCourse} from './create-course';

AdminToolbar.propTypes = {
	store: PropTypes.object.isRequired
};


export default function AdminToolbar ({store}) {
	return (
		<div className="administrator-toolbar">
			<div>Administrator</div>
			<div className="controls">
				<LinkTo.Path to="./siteadmin" className="admin-nav">
					<div className="icon-outline" />
				</LinkTo.Path>

				<CreateCourse canCreate store={store} />
			</div>
		</div>
	);
}

import './AdminToolbar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { LinkTo } from '@nti/web-routing';
import { scoped } from '@nti/lib-locale';

import { CreateButton } from './object-creation';

const t = scoped('library.components.AdminToolbar', {
	adminPanel: 'Admin Panel',
});

AdminToolbar.propTypes = {
	store: PropTypes.object.isRequired,
};
export default function AdminToolbar({ store }) {
	return (
		<div className="administrator-toolbar">
			<div>Administrator</div>
			<div className="controls">
				<LinkTo.Path to="/app/siteadmin" className="admin-nav">
					<div className="icon-outline" />
					<span>{t('adminPanel')}</span>
				</LinkTo.Path>

				<CreateButton canCreate store={store} />
			</div>
		</div>
	);
}

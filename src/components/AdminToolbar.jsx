import React from 'react';

export default function AdminToolbar () {
	return (
		<div className="administrator-toolbar">
			<div>Administrator</div>
			<div className="controls">
				<a className="admin-nav" href="/siteadmin" />
				<div className="admin-create-button">
					<div className="add-container">
						<i className="icon-add" />
					</div>
					<div className="create-label">Create</div>
				</div>
			</div>
		</div>
	);
}

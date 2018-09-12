import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

export default class AddButton extends React.Component {
	static contextTypes = {
		router: PropTypes.object,
		basePath: PropTypes.string
	}

	render () {
		const baseroute = this.context.basePath != null ? this.context.basePath : this.context.router.baseroute.replace('library', '');

		return (
			<LinkTo.Path to={baseroute + '/catalog'} className="button library-add">
				Add
			</LinkTo.Path>
		);
	}
}

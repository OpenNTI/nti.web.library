import React from 'react';
import PropTypes from 'prop-types';
import {LinkTo} from '@nti/web-routing';

export default class AddButton extends React.Component {
	static contextTypes = {
		basePath: PropTypes.string
	}

	render () {
		return (
			<LinkTo.Path to={this.context.basePath + '/catalog'} className="button library-add">
				Add
			</LinkTo.Path>
		);
	}
}

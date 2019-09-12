import React from 'react';
import PropTypes from 'prop-types';
import {Community} from '@nti/web-profiles';

export default class CommunityItem extends React.Component  {
	static handles (item) {
		return item.isCommunity;
	}

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {
		let {item} = this.props;

		return (
			<Community.Card community={item} />
		);
	}
}

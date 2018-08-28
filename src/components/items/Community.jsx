import React from 'react';
import PropTypes from 'prop-types';
import {User} from '@nti/web-profiles';

const {CommunityCard} = User;

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
			<CommunityCard community={item} />
		);
	}
}

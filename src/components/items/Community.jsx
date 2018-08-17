import React from 'react';
import PropTypes from 'prop-types';

import unresolvedGroupImage from '../../resources/images/unresolved-group.png';

export default class CommunityItem extends React.Component  {
	static handles (item) {
		return item.isCommunity;
	}

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {
		let {item} = this.props;
		//href={'/community/' + item.Username}

		return (
			<div className="community-item">
				<img className="avatar" src={item.avatarURL || unresolvedGroupImage} />
				<div className="title-container" >
					{item.alias || item.Username}
				</div>
			</div>
		);
	}
}

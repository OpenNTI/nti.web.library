import React from 'react';
import PropTypes from 'prop-types';

import defaultImage from '../../resources/images/default-card-image.png';

export default class Bundle extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired
	}

	static handles (item) {
		return item.isBundle;
	}


	render () {
		const {props: {item}} = this;
		let {byline, author, title} = item || {};

		return (
			<div className="book-card">
				<img src={defaultImage} />
				<label>
					<h3 className="book-title">{title}</h3>
					<address className="book-author">{byline || author}</address>
				</label>
			</div>
		);
	}
}

import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

export default class Books extends React.Component {
	static propTypes = {
		items: PropTypes.array
	}

	render () {
		const {props: {items}} = this;

		return (
			<Container section="books" items={items}/>
		);
	}
}

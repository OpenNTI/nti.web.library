import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

export default class Courses extends React.Component {
	static propTypes = {
		admin: PropTypes.bool,
		items: PropTypes.array
	}

	render () {
		const {props: {admin, items}} = this;
		const section = admin ? 'admin' : 'courses';

		return (
			<Container section={section} items={items}/>
		);
	}
}

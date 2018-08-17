import React from 'react';
import PropTypes from 'prop-types';
import {Card} from '@nti/web-course';

export default class Course extends React.Component  {
	static handles (item) {
		return item.isCourse;
	}

	static propTypes = {
		item: PropTypes.object.isRequired
	};

	render () {
		const {props: {item}} = this;

		return (
			<Card course={item.CatalogEntry} />
		);
	}
}

import React from 'react';
import PropTypes from 'prop-types';

export default class AddButton extends React.Component {
	static propTypes = {
		section: PropTypes.string.isRequired
	}

	render () {
		const {props: {section}, constructor: self} = this;

		// let link = (this.getBasePath() + '/catalog/').replace(/\/\//g, '/');

		// if (!self.canSectionBeAddedTo(section)) {
		// 	return null;
		// }

		return (
			<a href={'/catalog'} className="button library-add">Add</a>
		);
	}
}

import './Bundle.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { BookCard } from '@nti/web-content';

export default class Bundle extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		variant: PropTypes.string,
	};

	static handles(item) {
		return item.isBundle;
	}

	render() {
		const {
			props: { item, variant },
		} = this;

		return <BookCard bundle={item} variant={variant} />;
	}
}

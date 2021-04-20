import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

const Books = props => <Container section="books" {...props} />;

Books.propTypes = {
	items: PropTypes.array,
	sortOn: PropTypes.any,
	sortOptions: PropTypes.array,
	onSortChange: PropTypes.func,
};

export default Books;

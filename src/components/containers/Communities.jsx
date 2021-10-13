import PropTypes from 'prop-types';

import Container from './Container';

Communities.propTypes = {
	items: PropTypes.array,
};

export default function Communities({ items }) {
	return <Container section="communities" items={items} />;
}

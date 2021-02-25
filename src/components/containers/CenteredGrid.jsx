import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './CenteredGrid.css';

// append 'px' if it's a number otherwise leave it alone
const numpx = num => typeof num === 'number' ? `${num}px` : num;

// Renders a grid container that fills with as many columns as will fit, centered
export default function CenteredGrid ({as: Cmp = 'div', colsize, gap = 0, className, ...other}) {
	const cssProperties = {
		'--colsize': numpx(colsize),
		'--gap': numpx(gap),
	};
	return (
		<Cmp
			style={cssProperties}
			className={cx(styles.container, className)}
			{...other}
		/>
	);
}

// sets 'grid-column: 1 / -1' to occupy a full row
CenteredGrid.Header = ({as: Cmp = 'div', className, ...props}) => (
	<Cmp className={cx(styles.header, className)} {...props} />
);

CenteredGrid.propTypes = {
	as: PropTypes.node,
	colsize: PropTypes.oneOfType([
		PropTypes.number, // e.g. 200
		PropTypes.string // e.g. 'minmax(200, 1fr)'
	]).isRequired,
	gap: PropTypes.number
};

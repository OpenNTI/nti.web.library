import { join } from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';
import { LinkTo } from '@nti/web-routing';

const styles = stylesheet`
.add-button:global(.nti-link-to-path) {
	color: white;
	background-color: var(--secondary-green);
	border-radius: 4px;
	padding: 0.25rem 1rem;
	cursor: pointer;
	font: normal 400 1rem/1.375 var(--body-font-family);
	text-decoration: none;
}
`;

const t = scoped('library.components.AddButton', {
	courses: '+ Add',
});

export default class AddButton extends React.Component {
	static propTypes = {
		section: PropTypes.string,
	};

	static contextTypes = {
		router: PropTypes.object,
		basePath: PropTypes.string,
		section: PropTypes.string,
	};

	render() {
		const { section } = this.props;
		const baseroute =
			this.context.basePath ??
			this.context.router.baseroute.replace('library', '');

		if (t.isMissing(section)) {
			return null;
		}

		return (
			<LinkTo.Path
				to={join(baseroute, 'catalog')}
				className={cx('button', 'library-add', styles.addButton)}
			>
				{t(section)}
			</LinkTo.Path>
		);
	}
}

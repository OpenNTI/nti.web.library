import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

const styles = css`
.add-button {
	color: var(--primary-blue);
	cursor: pointer;
	font: normal 600 0.875em/2em var(--body-font-family);
	font-size: 14px;
	text-decoration: none;
}
`;

const t = scoped('library.components.AddButton', {
	courses: '+ Add'
});

export default class AddButton extends React.Component {
	static propTypes = {
		section: PropTypes.string
	}

	static contextTypes = {
		router: PropTypes.object,
		basePath: PropTypes.string,
		section: PropTypes.string
	}

	render () {
		const {section} = this.props;
		const baseroute = this.context.basePath ?? this.context.router.baseroute.replace('library', '');

		if (t.isMissing(section)) { return null; }

		return (
			<LinkTo.Path to={join(baseroute, 'catalog')} className={cx('button', 'library-add', styles.addButton)}>
				{t(section)}
			</LinkTo.Path>
		);
	}
}

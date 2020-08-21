import './AddButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {LinkTo} from '@nti/web-routing';

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
		const baseroute = this.context.basePath != null ? this.context.basePath : this.context.router.baseroute.replace('library', '');

		if (t.isMissing(section)) { return null; }

		return (
			<LinkTo.Path to={baseroute + '/catalog'} className="button library-add">
				{t(section)}
			</LinkTo.Path>
		);
	}
}

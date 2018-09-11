import React from 'react';
import {LinkTo} from '@nti/web-routing';
import {Layouts} from '@nti/web-commons';

const {Responsive} = Layouts;

export default class AddButton extends React.Component {
	render () {
		const catalogLink = Responsive.isMobileContext ? './mobile/catalog' : './catalog';

		return (
			<LinkTo.Path to={catalogLink} className="button library-add">
				Add
			</LinkTo.Path>
		);
	}
}

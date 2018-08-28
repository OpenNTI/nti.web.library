import React from 'react';
import {LinkTo} from '@nti/web-routing';

export default class AddButton extends React.Component {
	render () {

		return (
			<LinkTo.Path to="./catalog" className="button library-add">
				Add
			</LinkTo.Path>
		);
	}
}

import './Collection.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import getItem from '../items';

const isEmpty = s => s == null || s === '';

export default class LibraryCollection extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		list: PropTypes.array,
		title: PropTypes.string,
		subtitle: PropTypes.string,
		onModification: PropTypes.func,
		children: PropTypes.any
	}

	render () {
		const {props: {children, className, list, title, subtitle, onModification}} = this;

		let titleRow = isEmpty(title) ? null : ( <h5>{title}<label>{subtitle}</label></h5> );

		return (
			<div className={cx('library-collection', className)}>
				{titleRow}
				{children}
				<ul>
					{list.map(item => {
						let Item = getItem(item);
						let catalogEntry = item.CatalogEntry || {};

						return Item && (
							<li className="library-object" key={item.NTIID || item.href || catalogEntry.NTIID || catalogEntry.href} >
								<Item item={item} onModification={onModification} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

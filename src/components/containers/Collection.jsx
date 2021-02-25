import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import getItem from '../items';

import Grid from './Grid';
import './Collection.scss';

const isEmpty = s => s == null || s === '';

const Title = ({title, subtitle}) => isEmpty(title) ? null : (
	<h5>
		{title}
		<label>{subtitle}</label>
	</h5>
);

export default function LibraryCollection ({
	children,
	className,
	list,
	title,
	subtitle,
	onModification,
}) {
	return (
		<Grid className={cx('library-collection', className)}>
			<Grid.Header>
				<Title title={title} subtitle={subtitle} />
				{children}
			</Grid.Header>
			<Grid as="ul">
				{list.map(item => {
					const Item = getItem(item);
					const key =
						item.NTIID ||
						item.href ||
						item?.CatalogEntry?.NTIID ||
						item?.CatalogEntry?.href;

					return (
						Item && (
							<li
								className="library-object"
								data-testid={key}
								key={key}
							>
								<Item
									item={item}
									onModification={onModification}
								/>
							</li>
						)
					);
				})}
			</Grid>
		</Grid>
	);
}

LibraryCollection.propTypes = {
	className: PropTypes.string,
	list: PropTypes.array,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	onModification: PropTypes.func,
	children: PropTypes.any,
};

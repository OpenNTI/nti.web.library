import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { CollectionSortable as CourseCollection } from '@nti/web-course';

import getItem from '../items';

const { Grid } = CourseCollection;
const isEmpty = s => s == null || s === '';

const Title = ({ title, subtitle }) =>
	isEmpty(title) ? null : (
		<h5>
			{title}
			<label>{subtitle}</label>
		</h5>
	);

const Container = styled(Grid)`
	margin-bottom: 30px;

	/* Grids are blocks, which fill their container's width leave these unset:
	/* width: 100vw;
	max-width: 100%; */

	@media (--respond-to-handhelds) {
		margin-bottom: 5px;
	}
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	font-size: 16px;
	font-weight: 400;
	line-height: normal;
`;

const ListItem = styled.li`
	margin: 0;
	position: relative;
	a {
		text-decoration: none;
	}
`;

export default function LibraryCollection({
	children,
	className,
	list,
	title,
	subtitle,
	onModification,
}) {
	return (
		<Container className={cx('library-collection', className)}>
			<Grid.Header>
				<Title title={title} subtitle={subtitle} />
				{children}
			</Grid.Header>
			<Grid as={List}>
				{columns => {
					return list.map(item => {
						const Item = getItem(item);
						const key =
							item.NTIID ||
							item.href ||
							item?.CatalogEntry?.NTIID ||
							item?.CatalogEntry?.href;

						return (
							Item && (
								<ListItem
									className="library-object"
									data-testid={key}
									key={key}
								>
									<Item
										variant={
											columns > 1 ? 'card' : 'list-item'
										}
										item={item}
										onModification={onModification}
									/>
								</ListItem>
							)
						);
					});
				}}
			</Grid>
		</Container>
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

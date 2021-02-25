import './Collection.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import getItem from '../items';

import CenteredGrid from './CenteredGrid';

const isEmpty = s => s == null || s === '';

const Title = ({title, subtitle}) => isEmpty(title) ? null : (
	<h5>
		{title}
		<label>{subtitle}</label>
	</h5>
);

const Container = props => <CenteredGrid colsize={242} gap={14} {...props} />

export default function LibraryCollection ({
	children,
	className,
	list,
	title,
	subtitle,
	onModification,
}) {
	return (
		<Container className={cx('library-collection', className)}>
			<CenteredGrid.Header>
				<Title title={title} subtitle={subtitle} />
				{children}
			</CenteredGrid.Header>
			<Container as="ul">
				{list.map(item => {
					const Item = getItem(item);
					const key =
						item.NTIID ||
						item.href ||
						item?.CatalogEntry?.NTIID ||
						item?.CatalogEntry?.href;

					return (
						Item && (
							<>
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
								{/* repeated for dev purposes. take this out. */}
								<li
									className="library-object"
									data-testid={key}
									key={key + Math.random()}
								>
									<Item
										item={item}
										onModification={onModification}
									/>
								</li>
								<li
									className="library-object"
									data-testid={key}
									key={key + Math.random()}
								>
									<Item
										item={item}
										onModification={onModification}
									/>
								</li>
								<li
									className="library-object"
									data-testid={key}
									key={key + Math.random()}
								>
									<Item
										item={item}
										onModification={onModification}
									/>
								</li>
								<li
									className="library-object"
									data-testid={key}
									key={key + Math.random()}
								>
									<Item
										item={item}
										onModification={onModification}
									/>
								</li>
							</>
						)
					);
				})}
			</Container>
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

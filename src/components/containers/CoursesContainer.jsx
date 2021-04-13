import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

export default class Courses extends React.Component {
	static propTypes = {
		admin: PropTypes.bool,
		hasMore: PropTypes.bool,
		items: PropTypes.array,
		itemsType: PropTypes.string,
		onModification: PropTypes.func,
		sortOptions: PropTypes.arrayOf(PropTypes.string),
		onSortChange: PropTypes.func,
	};

	splitItemsBySemester(section) {
		const {
			props: { items, onModification, hasMore },
		} = this;

		return (
			<>
				{items.map(item => {
					return (
						<Container
							section={section}
							key={item.semester}
							date={item.semester}
							items={item.courses}
							hasMore={hasMore}
							onModification={onModification}
						/>
					);
				})}
			</>
		);
	}

	render() {
		const {
			props: {
				admin,
				hasMore,
				items,
				itemsType = '',
				onModification,
				sortOptions,
				onSortChange,
			},
		} = this;
		const section = itemsType + (admin ? 'admin' : 'courses');

		return itemsType !== 'archived' ? (
			<Container
				section={section}
				items={items}
				hasMore={hasMore}
				sortOptions={sortOptions}
				onSortChange={onSortChange}
				onModification={onModification}
			/>
		) : (
			this.splitItemsBySemester(section)
		);
	}
}

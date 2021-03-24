import React from 'react';
import PropTypes from 'prop-types';

import Container from './Container';

export default class Courses extends React.Component {
	static propTypes = {
		admin: PropTypes.bool,
		items: PropTypes.array,
		itemsType: PropTypes.string,
		onModification: PropTypes.func,
		onSortChange: PropTypes.func,
	};

	splitItemsBySemester(section) {
		const {
			props: { items, onModification },
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
				items,
				itemsType = '',
				onModification,
				onSortChange,
			},
		} = this;
		const section = itemsType + (admin ? 'admin' : 'courses');

		return itemsType !== 'archived' ? (
			<Container
				section={section}
				items={items}
				onSortChange={onSortChange}
				onModification={onModification}
			/>
		) : (
			this.splitItemsBySemester(section)
		);
	}
}

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
		onDelete: PropTypes.func,
		onBeforeDrop: PropTypes.func,
		onAfterDrop: PropTypes.func,
		sortOptions: PropTypes.arrayOf(PropTypes.string),
		onSortChange: PropTypes.func,
	};

	splitItemsBySemester(section) {
		const { items } = this.props;

		return (
			<>
				{items.map(item => {
					return (
						<Container
							{...this.commonContainerProps()}
							section={section}
							key={item.semester}
							date={item.semester}
						/>
					);
				})}
			</>
		);
	}

	commonContainerProps = () => {
		const {
			admin,
			hasMore,
			items,
			itemsType = '',
			onModification,
			onBeforeDrop,
			onAfterDrop,
			onDelete,
			sortOptions,
			onSortChange,
		} = this.props;

		const section = itemsType + (admin ? 'admin' : 'courses');

		return {
			section,
			items,
			hasMore,
			sortOptions,
			onSortChange,
			onModification,
			onBeforeDrop,
			onAfterDrop,
			onDelete,
		};
	};

	render() {
		const {
			props: { itemsType = '' },
		} = this;

		const containerProps = this.commonContainerProps();

		return itemsType !== 'archived' ? (
			<Container {...containerProps} />
		) : (
			this.splitItemsBySemester(containerProps.section)
		);
	}
}

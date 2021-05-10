import React from 'react';
import PropTypes from 'prop-types';

import { EmptyList } from '@nti/web-commons';
import { Collection as CourseCollection } from '@nti/web-course';

import Heading from '../SectionHeading';

import Collection from './Collection';

const { Grid } = CourseCollection;

const Empty = styled(EmptyList)`
	text-align: center;
	color: var(--tertiary-grey);
	font-size: 2rem;
	grid-column: full;

	/* safari 13 bug doesn't know where "full" starts */
	grid-column-start: 1;
`;

export default function Container({
	section,
	items,
	hasMore,
	date,
	onModification,
	onDelete,
	sortOptions,
	onSortChange,
}) {
	return !items?.length ? (
		<Grid className="library-collection">
			<Grid.Header>
				<Heading section={section} empty />
				<Empty type={`library-${section}`} />
			</Grid.Header>
		</Grid>
	) : (
		<Collection
			className={section}
			list={items}
			onModification={onModification}
			onDelete={onDelete}
		>
			<Heading
				section={section}
				hasMore={hasMore}
				date={date}
				sortOptions={sortOptions}
				onSortChange={onSortChange}
			/>
		</Collection>
	);
}

Container.propTypes = {
	section: PropTypes.string,
	items: PropTypes.array,
	hasMore: PropTypes.bool,
	date: PropTypes.string,
	onModification: PropTypes.func,
	onDelete: PropTypes.func,
	sortOptions: PropTypes.arrayOf(PropTypes.string),
	onSortChange: PropTypes.func,
};

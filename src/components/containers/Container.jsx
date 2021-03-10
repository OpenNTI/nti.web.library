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

export default function Container({ section, items, date, onModification }) {
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
		>
			<Heading section={section} date={date} />
		</Collection>
	);
}

Container.propTypes = {
	section: PropTypes.string,
	items: PropTypes.array,
	date: PropTypes.string,
	onModification: PropTypes.func,
};

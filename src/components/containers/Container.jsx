import './Container.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { EmptyList } from '@nti/web-commons';

import Heading from '../SectionHeading';

import Grid from './Grid';
import Collection from './Collection';

export default function Container({ section, items, date, onModification }) {
	return !items?.length ? (
		<Grid className="library-collection">
			<Grid.Header>
				<Heading section={section} empty />
				<EmptyList type={`library-${section}`} />
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

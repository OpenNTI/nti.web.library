import React from 'react';
import PropTypes from 'prop-types';
import {EmptyList} from '@nti/web-commons';

import Heading from '../SectionHeading';

import Collection from './Collection';

export default function Container ({section, items, date}) {
	return !items || items.length === 0 ?
		(
			<div className="library-collection">
				<Heading section={section}/>
				<EmptyList type={`library-${section}`}/>
			</div>
		) : (
			<Collection className={section} list={items} >
				<Heading section={section} date={date} />
			</Collection>
		);
}

Container.propTypes = {
	section: PropTypes.string,
	items: PropTypes.array,
	date: PropTypes.string
};

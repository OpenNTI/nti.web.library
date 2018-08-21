import PropTypes from 'prop-types';
import React from 'react';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

SectionHeading.propTypes = {
	section: PropTypes.string.isRequired
};

export default function SectionHeading ({section}) {
	return (
		<div className="library-section-heading">
			<SectionTitle section={section} href={`/${section}/`}/>
			{section === 'courses' && (
				<div className="course-section-heading">
					<AddButton section={section}/>
					<a className="see-all">See All</a>
				</div>
			)}

		</div>
	);
}

import PropTypes from 'prop-types';
import React from 'react';
import {LinkTo} from '@nti/web-routing';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';

SectionHeading.propTypes = {
	section: PropTypes.string.isRequired,
	date: PropTypes.string
};

export default function SectionHeading ({section, date}) {
	return (
		<div className="library-section-heading">
			<SectionTitle section={section} />
			{(section === 'courses' || section === 'admin') && (
				<div className="course-section-heading">
					{section === 'courses' ? (
						<AddButton />
					) : (
						<div />
					)}

					<LinkTo.Name name={section === 'admin' ? ('library-admin-courses') : ('library-courses')} className="see-all">
						See All
					</LinkTo.Name>
				</div>
			)}
			{section === 'archivedcourses' && (
				<div className="course-section-heading-date">
					{date}
				</div>
			)}

		</div>
	);
}

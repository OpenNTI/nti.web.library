import PropTypes from 'prop-types';

import { getSectionTitle as t } from './utils/get-section-title.js';

const TitleMap = {
	upcoming: 'upcomingcourses',
	current: 'currentcourses',
	archived: 'archivedcourses',
};

const SectionTitle = styled('h1').attrs(({ section, ...props }) => ({
	...props,
	children: t(section),
}))`
	font: normal 300 1.25em/2em var(--body-font-family);
	color: white;
	font-size: 18px;
	margin: 0;
	white-space: nowrap;

	:global(.library-light-background) & {
		color: var(--secondary-grey);
	}
`;

export default SectionTitle;

SectionTitle.getTitle = section => {
	const key = TitleMap[section] ?? section;

	return t.isMissing(key) ? section : t(key);
};

SectionTitle.propTypes = {
	section: PropTypes.string.isRequired,
	href: PropTypes.string,
};

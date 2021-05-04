import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { LinkTo } from '@nti/web-routing';
import { Connectors } from '@nti/lib-store';
import { Layouts, Menu } from '@nti/web-commons';
import { CollectionSortable as Collection } from '@nti/web-course';

import { getSectionTitleStrings } from './utils/get-section-title.js';
import AddButton from './AddButton';

const { Responsive } = Layouts;

const Wrapper = styled('div')`
	display: flex;
	align-items: baseline;
	grid-column: full;

	/* safari 13 bug doesn't know where "full" starts */
	grid-column-start: 1;
`;

const CourseSectionHeading = styled('div')`
	width: 100%;
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	margin-left: 0.8em;
`;

const SeeAllLink = styled(LinkTo.Path)`
	color: var(--text-color-nav-link, white);
	cursor: pointer;
	font: normal 300 0.875em/2em var(--body-font-family);
	font-size: 14px;
	line-height: 28px;
	text-decoration: none;

	:global(.library-view.library-light-background) & {
		color: var(--secondary-grey);
	}
`;

const HeadingDate = styled('div')`
	color: rgba(255, 255, 255, 0.3);
	margin-left: 0.5em;
	font-size: 18px;
	line-height: 18px;
`;

const SubTitleText = styled('span')`
	@media (--respond-to-handhelds) {
		line-height: 1;
		font-size: 0.75em;
		display: block;
	}
`;

const Title = ({ name, sort }) => (
	<span>
		<span>{name}</span>
		{sort && <SubTitleText>{sort}</SubTitleText>}
	</span>
);

class SectionHeading extends React.Component {
	static propTypes = {
		section: PropTypes.string.isRequired,
		date: PropTypes.string,
		empty: PropTypes.bool,
		hasMore: PropTypes.bool,
		courses: PropTypes.shape({
			items: PropTypes.array,
			total: PropTypes.number,
			sortOn: PropTypes.string,
			sortOrder: PropTypes.string,
		}),
		admin: PropTypes.shape({
			items: PropTypes.array,
			total: PropTypes.number,
			sortOn: PropTypes.string,
			sortOrder: PropTypes.string,
		}),
		hasSearchTerm: PropTypes.bool,
		sortOptions: PropTypes.arrayOf(PropTypes.string),
		onSortChange: PropTypes.func,
	};

	static contextTypes = {
		router: PropTypes.object.isRequired,
		basePath: PropTypes.string,
	};

	showSeeAll() {
		const { hasSearchTerm, hasMore } = this.props;
		return !hasSearchTerm && hasMore;
	}

	render() {
		const { section, date, empty, sortOptions, onSortChange } = this.props;
		const data = this.props[section] || {};

		const { router, basePath } = this.context;
		let base;

		if (Responsive.isMobileContext()) {
			base = basePath;
		} else {
			base = router.baseroute
				? '/' + router.baseroute.split('/')[1] + '/'
				: '';
		}

		return (
			<Wrapper>
				<Menu.Select
					getText={Collection.getSortOptionText}
					value={data.sortOn}
					title={
						<Title
							{...getSectionTitleStrings(section, data.sortOn)}
						/>
					}
					options={sortOptions}
					onChange={onSortChange}
				/>
				{(section === 'courses' || section === 'admin') && (
					<CourseSectionHeading>
						{section === 'courses' ? (
							<AddButton section={section} />
						) : (
							<div />
						)}

						{!empty && this.showSeeAll() && (
							<SeeAllLink
								to={
									section === 'admin'
										? base + 'library/admin-courses'
										: base + 'library/courses'
								}
							>
								See All
							</SeeAllLink>
						)}
					</CourseSectionHeading>
				)}
				{section === 'archivedcourses' && (
					<HeadingDate>{date}</HeadingDate>
				)}
			</Wrapper>
		);
	}
}

export default decorate(SectionHeading, [
	Connectors.Any.connect({
		EnrolledCourses: 'courses',
		AdministeredCourses: 'admin',
		hasSearchTerm: 'hasSearchTerm',
	}),
]);

import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { LinkTo } from '@nti/web-routing';
import { Connectors } from '@nti/lib-store';
import { Flyout, Layouts, List } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import SectionTitle from './SectionTitle';
import AddButton from './AddButton';
import './SectionHeading.scss';

const { Responsive } = Layouts;

const t = scoped('library.sorting', {
	createdTime: 'By Date Added',
	provideruniqueid: 'By ID',
	lastSeenTime: 'By Last Opened',
	title: 'By Title',
});

const getSortOptions = section => [
	'createdTime',
	'provideruniqueid',
	'lastSeenTime',
	'title',
];

const Menu = styled(List.Unadorned)`
	font-size: 14px;
	line-height: 19px;
	font-weight: 600;
	color: var(--primary-grey);
	border-radius: 4px;
	min-width: 200px;

	li {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border-grey-light);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
`;

const MenuContent = ({ dismissFlyout, options, onChange, ...other }) => {
	const onClick = option => {
		onChange(option);
		dismissFlyout();
	};
	return (
		<Menu>
			{options.map(option => (
				<li key={option} onClick={() => onClick(option)}>
					{t(option)}
				</li>
			))}
		</Menu>
	);
};

const HeaderMenu = ({ section, onSortChange, ...props }) => {
	const sortOptions = React.useMemo(
		() => onSortChange && getSortOptions(section),
		[section, onSortChange]
	);
	const Text = <SectionTitle section={section} />;
	return !sortOptions?.length ? (
		Text
	) : (
		<Flyout.Triggered
			horizontalAlign={Flyout.ALIGNMENTS.LEFT}
			trigger={<SectionTitle section={section} />}
		>
			<MenuContent onChange={onSortChange} options={sortOptions} />
		</Flyout.Triggered>
	);
};

class SectionHeading extends React.Component {
	static propTypes = {
		section: PropTypes.string.isRequired,
		date: PropTypes.string,
		empty: PropTypes.bool,
		courses: PropTypes.array,
		totalCourses: PropTypes.number,
		administeredCourses: PropTypes.array,
		totalAdministeredCourses: PropTypes.number,
		hasSearchTerm: PropTypes.bool,
		onSortChange: PropTypes.func,
	};

	static contextTypes = {
		router: PropTypes.object.isRequired,
		basePath: PropTypes.string,
	};

	showSeeAll() {
		const {
			section,
			courses,
			totalCourses,
			administeredCourses,
			totalAdministeredCourses,
			hasSearchTerm,
		} = this.props;

		if (section === 'courses' && !hasSearchTerm) {
			return (courses && courses.length) < totalCourses;
		} else if (section === 'admin' && !hasSearchTerm) {
			return (
				(administeredCourses && administeredCourses.length) <
				totalAdministeredCourses
			);
		}

		return false;
	}

	render() {
		const { section, date, empty, onSortChange } = this.props;
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
			<div className="library-section-heading">
				<HeaderMenu section={section} onSortChange={onSortChange} />
				{(section === 'courses' || section === 'admin') && (
					<div className="course-section-heading">
						{section === 'courses' ? (
							<AddButton section={section} />
						) : (
							<div />
						)}

						{!empty && this.showSeeAll() && (
							<LinkTo.Path
								to={
									section === 'admin'
										? base + 'library/admin-courses'
										: base + 'library/courses'
								}
								className="see-all"
							>
								See All
							</LinkTo.Path>
						)}
					</div>
				)}
				{section === 'archivedcourses' && (
					<div className="course-section-heading-date">{date}</div>
				)}
			</div>
		);
	}
}

export default decorate(SectionHeading, [
	Connectors.Any.connect({
		courses: 'courses',
		totalCourses: 'totalCourses',
		administeredCourses: 'administeredCourses',
		totalAdministeredCourses: 'totalAdministeredCourses',
		hasSearchTerm: 'hasSearchTerm',
	}),
]);

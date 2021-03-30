import React from 'react';

import { scoped } from '@nti/lib-locale';
import { Flyout, List } from '@nti/web-commons';

import SectionTitle from './SectionTitle';

const t = scoped('library.sorting', {
	createdTime: 'By Date Added',
	provideruniqueid: 'By ID',
	lastSeenTime: 'By Last Opened',
	title: 'By Title',
});

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

export const SortMenu = ({ section, sortOptions, onSortChange, ...props }) => {
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

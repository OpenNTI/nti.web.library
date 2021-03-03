import { LinkTo } from '@nti/web-routing';

export const Container = styled.div`
	min-height: calc(
		100vh - var(--nt-app-top-offset, 70px) - var(--webapp-library-top-gap)
	);
	height: auto !important;
	width: 1024px;
	max-width: 100vw;
	font: normal 300 1.25em/2em var(--body-font-family);
	font-size: 20px;
`;

export const Toolbar = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32px;

	@media (--respond-to-handhelds) {
		margin: 15px;
	}
`;

export const Breadcrumbs = styled.div`
	display: flex;
	align-items: center;
	padding-bottom: 10px;
	box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.2),
		0 1px 0 0 rgba(255, 255, 255, 0.08);
	font: normal 400 0.875em/2em var(--body-font-family);
	font-size: 14px;
	line-height: 28px;
	color: white;

	:global(.library-light-background) & {
		color: var(--secondary-grey);
	}
`;

export const HomeCrumb = styled(LinkTo.Name).attrs({ name: 'library-home' })`
	cursor: pointer;
	text-decoration: none;
`;

export const CurrentSectionTitleCrumb = styled.div`
	opacity: 0.5;

	&::before {
		content: '\203A';
		margin: 0 0.5em;
		font-size: 1.3em;
		font-weight: 300;
	}
`;

export const AddCourseLink = styled(LinkTo.Path)`
	cursor: pointer;
	font: normal 300 0.875em/35px var(--body-font-family);
	text-align: center;
	border-radius: 5px;
	padding: 0 1.5em;
	text-decoration: none;
	margin-left: auto;
	font-size: 14px;
	line-height: 35px;

	/* double-class-specificity to ensure these colors are applied over single-class-specificity */
	&& {
		color: white;
		background-color: var(--secondary-green);
	}
`;

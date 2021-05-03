/* eslint-env jest */
jest.mock('../HomeStore', () => ({
	connect: () => () => {},
}));

import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';

import { setupTestClient } from '@nti/web-client/test-utils';

const mockCourse = ({ NTIID, ...props }) => ({
	title: 'Test Course',
	isCourse: true,
	NTIID,
	MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
	getStartDate: () => {},
	getEndDate: () => {},
	CatalogEntry: {
		CourseNTIID: NTIID,
		getStartDate: () => {},
		getEndDate: () => {},
		getAuthorLine: () => {},
		getDefaultAssetRoot: () => {},
	},
	...props,
});

import HomePage from '../View';
const onBefore = () =>
	setupTestClient({
		getEnrollment: () => ({
			addListener: jest.fn(),
			removeListener: jest.fn(),
		}),
	});

class Context extends React.Component {
	static childContextTypes = {
		router: PropTypes.object,
	};

	getChildContext() {
		return {
			router: {
				baseroute: '/',
				history: {
					createHref: location => {},
					push: (path, state) => {},
					replace: (path, state) => {},
				},
			},
		};
	}

	render() {
		return <Suspense fallback={<div />}>{this.props.children}</Suspense>;
	}
}

describe('Home page test', () => {
	beforeEach(onBefore);

	test('Non-admin home page test', async () => {
		const communities = [
			{
				ID: 'ou.nextthought.com',
				Username: 'ou.nextthought.com',
				alias: 'OU',
				isCommunity: true,
				NTIID:
					'tag:nextthought.com,2011-10:system-NamedEntity:Community-ou.nextthought.com',
			},
		];

		const courses = [
			{
				title: 'Test Course 1',
				NTIID: 'bWj9Mk6A5P7',
			},
			{
				title: 'Test Course 2',
				NTIID: 'bWj9Mk6A5P8',
			},
			{
				title: 'Test Course 3',
				NTIID: 'bWj9Mk6A5P9',
			},
			{
				title: 'Test Course 4',
				NTIID: 'bWj9Mk6A5P6',
			},
			{
				title: 'Test Course 5',
				NTIID: 'bWj9Mk6A5P5',
			},
			{
				title: 'Test Course 6',
				NTIID: 'bWj9Mk6A5P4',
			},
		].map(x =>
			mockCourse({
				...x,
				NTIID: `tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:${x.NTIID}`,
			})
		);

		const books = [
			{
				title: 'Book 1',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067172',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 2',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067173',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 3',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067174',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 4',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067175',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 5',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067176',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
		];

		const { container, findByTestId, unmount } = render(
			<Context>
				<HomePage
					communities={communities}
					courses={courses}
					books={books}
					loading={false}
				/>
			</Context>
		);

		expect(await findByTestId(communities[0].NTIID)).toBeTruthy();

		expect(container.querySelectorAll('.library-collection').length).toBe(
			3
		);
		expect(
			container.querySelectorAll('.library-collection.communities').length
		).toBe(1);
		expect(
			container.querySelectorAll('.library-collection.courses').length
		).toBe(1);
		expect(
			container.querySelectorAll('.library-collection.books').length
		).toBe(1);
		expect(
			container.querySelectorAll('a.nti-link-to-path.library-add').length
		).toBe(1);
		expect(
			container.querySelectorAll('.nti-course-card-container').length
		).toBe(6);
		expect(container.querySelectorAll('.book-card').length).toBe(5);
		expect(container.querySelectorAll('.community-card').length).toBe(1);
		expect(container.querySelectorAll('.library-object').length).toBe(12);

		await unmount();
	});

	test('Admin home page test', async () => {
		const communities = [
			{
				ID: 'ou.nextthought.com',
				Username: 'ou.nextthought.com',
				alias: 'OU',
				isCommunity: true,
				NTIID:
					'tag:nextthought.com,2011-10:system-NamedEntity:Community-ou.nextthought.com',
			},
		];

		const courses = [];

		const administeredCourses = [
			{
				title: 'Test Course 1',
				NTIID: 'bWj9Mk6A5P7',
			},
			{
				title: 'Test Course 2',
				NTIID: 'bWj9Mk6A5P8',
			},
			{
				title: 'Test Course 3',
				NTIID: 'bWj9Mk6A5P9',
			},
			{
				title: 'Test Course 4',
				NTIID: 'bWj9Mk6A5P6',
			},
			{
				title: 'Test Course 5',
				NTIID: 'bWj9Mk6A5P5',
			},
			{
				title: 'Test Course 6',
				NTIID: 'bWj9Mk6A5P4',
			},
		].map(x =>
			mockCourse({
				...x,
				NTIID: `tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:${x.NTIID}`,
			})
		);

		const books = [
			{
				title: 'Book 1',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067172',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 2',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067173',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 3',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067174',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 4',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067175',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
			{
				title: 'Book 5',
				author: 'Author',
				MimeType:
					'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID:
					'tag:nextthought.com,2011-10:OU-Bundle-717525311368067176',
				getDefaultAssetRoot: () => {},
				isPublished: () => true,
			},
		];

		const { container, findByTestId, unmount } = render(
			<Context>
				<HomePage
					communities={communities}
					courses={courses}
					administeredCourses={administeredCourses}
					admin
					books={books}
					loading={false}
				/>
			</Context>
		);

		expect(await findByTestId(communities[0].NTIID)).toBeTruthy();

		expect(container.querySelectorAll('.library-collection').length).toBe(
			3
		);
		expect(
			container.querySelectorAll('.library-collection.communities').length
		).toBe(1);
		expect(
			container.querySelectorAll('.library-collection.admin').length
		).toBe(1);
		expect(
			container.querySelectorAll('.library-collection.books').length
		).toBe(1);
		expect(
			container.querySelectorAll('a.nti-link-to-path.library-add').length
		).toBe(0);
		expect(
			container.querySelectorAll('.nti-course-card-container').length
		).toBe(6);
		expect(container.querySelectorAll('.book-card').length).toBe(5);
		expect(container.querySelectorAll('.community-card').length).toBe(1);
		expect(container.querySelectorAll('.library-object').length).toBe(12);

		await unmount();
	});
});

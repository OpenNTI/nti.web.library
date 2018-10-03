/* eslint-env jest */
jest.mock('../HomeStore', () => {

	return {
		connect: () => () => {}
	};

});

import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';

import HomePage from '../View';

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {})
	};
};


describe('Home page test', () => {
	beforeEach(onBefore);

	test('Non-admin home page test', async () => {
		const communities = [
			{
				ID: 'ou.nextthought.com',
				Username: 'ou.nextthought.com',
				alias: 'OU',
				isCommunity: true,
				NTIID: 'tag:nextthought.com,2011-10:system-NamedEntity:Community-ou.nextthought.com'
			}
		];

		const courses = [
			{
				title: 'Test Course 1',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P7',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 2',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P8',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 3',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P9',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 4',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P6',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 5',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P5',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 6',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P4',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			}
		];

		const books = [
			{
				title: 'Book 1',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067172',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 2',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067173',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 3',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067174',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 4',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067175',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 5',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067176',
				getDefaultAssetRoot: () => {}
			}
		];

		const homepageCmp = mount(
			<HomePage communities={communities} courses={courses} books={books} loading={false} />, {
				context: {
					router: {
						baseroute: '/',
						history: {
							createHref: (location) => {},
							push: (path, state) => {},
							replace: (path, state) => {}
						}
					}
				},
				childContextTypes: {
					router: PropTypes.object
				}
			}
		);

		expect(homepageCmp.find('.library-collection').length).toBe(3);
		expect(homepageCmp.find('.library-collection.communities').length).toBe(1);
		expect(homepageCmp.find('.library-collection.courses').length).toBe(1);
		expect(homepageCmp.find('.library-collection.books').length).toBe(1);
		expect(homepageCmp.find('a.nti-link-to-path.library-add').length).toBe(1);
		expect(homepageCmp.find('Course').length).toBe(6);
		expect(homepageCmp.find('.book-card').length).toBe(5);
		expect(homepageCmp.find('.user-community-card').length).toBe(1);
		expect(homepageCmp.find('.library-object').length).toBe(12);
	});

	test('Admin home page test', async () => {
		const communities = [
			{
				ID: 'ou.nextthought.com',
				Username: 'ou.nextthought.com',
				alias: 'OU',
				isCommunity: true,
				NTIID: 'tag:nextthought.com,2011-10:system-NamedEntity:Community-ou.nextthought.com'
			}
		];

		const courses = [];

		const administeredCourses = [
			{
				title: 'Test Course 1',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P7',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 2',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P8',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 3',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P9',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 4',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P6',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 5',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P5',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			},
			{
				title: 'Test Course 6',
				isCourse: true,
				NTIID: 'tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:bWj9Mk6A5P4',
				MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
				getStartDate: () => {},
				getEndDate: () => {},
				CatalogEntry: {
					getStartDate: () => {},
					getEndDate: () => {},
					getAuthorLine: () => {},
					getDefaultAssetRoot: () => {}
				}
			}
		];

		const books = [
			{
				title: 'Book 1',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067172',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 2',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067173',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 3',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067174',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 4',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067175',
				getDefaultAssetRoot: () => {}
			},
			{
				title: 'Book 5',
				author: 'Author',
				MimeType: 'application/vnd.nextthought.publishablecontentpackagebundle',
				isBundle: true,
				NTIID: 'tag:nextthought.com,2011-10:OU-Bundle-717525311368067176',
				getDefaultAssetRoot: () => {}
			}
		];

		const homepageCmp = mount(
			<HomePage communities={communities} courses={courses} administeredCourses={administeredCourses} admin books={books} loading={false} />, {
				context: {
					router: {
						baseroute: '/',
						history: {
							createHref: (location) => {},
							push: (path, state) => {},
							replace: (path, state) => {}
						}
					}
				},
				childContextTypes: {
					router: PropTypes.object
				}
			}
		);

		expect(homepageCmp.find('.library-collection').length).toBe(4);
		expect(homepageCmp.find('.library-collection.communities').length).toBe(1);
		expect(homepageCmp.find('.library-collection.admin').length).toBe(1);
		expect(homepageCmp.find('.library-collection.books').length).toBe(1);
		expect(homepageCmp.find('a.nti-link-to-path.library-add').length).toBe(1);
		expect(homepageCmp.find('Course').length).toBe(6);
		expect(homepageCmp.find('.book-card').length).toBe(5);
		expect(homepageCmp.find('.user-community-card').length).toBe(1);
		expect(homepageCmp.find('.library-object').length).toBe(12);
	});
});

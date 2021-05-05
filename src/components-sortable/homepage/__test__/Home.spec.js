/* eslint-env jest */
jest.mock('../Store', () => ({
	Store: {
		connect: () => () => {},
	},
	KEYS: {
		administeredCourses: 'AdministeredCourses',
		courses: 'EnrolledCourses',
		books: 'books',
		communities: 'communities',
	},
}));

import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';

import { setupTestClient } from '@nti/web-client/test-utils';

import { Home as HomePage } from '../Home';

import data from './library-data';
const { communities, books } = data;

const mockStore = {
	getSortOptions: collection => [],
};

const onBefore = () =>
	setupTestClient({
		getEnrollment: () => ({
			addListener: jest.fn(),
			removeListener: jest.fn(),
		}),
		getCollection: (title, workspace) => {
			return {
				href: title,
				getLink: () => title,
			};
		},
		getBatch: async (href, params) => {
			return data[href];
		},
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
		return this.props.children;
	}
}

describe('Home page test', () => {
	beforeEach(onBefore);

	xtest('Non-admin home page test', async () => {
		const { container, findByTestId, unmount } = render(
			<React.Suspense fallback={<div />}>
				<Context>
					<HomePage
						communities={communities}
						books={books}
						loading={false}
						store={mockStore}
					/>
				</Context>
			</React.Suspense>
		);

		expect(await findByTestId(communities[0].NTIID)).toBeTruthy();

		const qsa = (...args) => container.querySelectorAll(...args);

		expect(qsa('.library-collection').length).toBe(4);
		expect(qsa('.library-collection.communities').length).toBe(1);
		expect(qsa('.library-collection.courses').length).toBe(1);
		expect(qsa('.library-collection.books').length).toBe(1);
		expect(qsa('a.nti-link-to-path.library-add').length).toBe(1);
		expect(qsa('.nti-course-card-container').length).toBe(12);
		expect(qsa('.book-card').length).toBe(5);
		expect(qsa('.community-card').length).toBe(1);
		expect(qsa('.library-object').length).toBe(18);

		await unmount();
	});
});

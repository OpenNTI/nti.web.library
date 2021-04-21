/* eslint-env jest */
import { getSortOptions } from '../get-sort-options.js';
import { COLLECTION_NAMES } from '../../constants';

describe('library getSortOptions test', () => {
	test('handles unknown/unspecified collections', () => {
		expect(() => getSortOptions()).not.toThrow();
		expect(getSortOptions()).toHaveLength(0);

		expect(() => getSortOptions(null)).not.toThrow();
		expect(getSortOptions(null)).toHaveLength(0);

		expect(() => getSortOptions('')).not.toThrow();
		expect(getSortOptions('')).toHaveLength(0);

		expect(() => getSortOptions('foo')).not.toThrow();
		expect(getSortOptions('foo')).toHaveLength(0);
	});

	test('returns sort options', () => {
		expect(
			getSortOptions(COLLECTION_NAMES.administeredCourses).length
		).toBeGreaterThan(0);
		expect(
			getSortOptions(COLLECTION_NAMES.enrolledCourses).length
		).toBeGreaterThan(0);
	});
});

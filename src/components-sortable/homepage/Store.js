import { getService, getUserPreferences } from '@nti/web-client';
import { Stores, Mixins } from '@nti/lib-store';
import { decorate } from '@nti/lib-commons';
import { mixin } from '@nti/lib-decorators';
import { Models } from '@nti/lib-interfaces';
import AppDispatcher from '@nti/lib-dispatcher';

import { COLLECTION_NAMES } from '../constants';
import { getSortOptions } from '../utils/get-sort-options';

const {
	library: {
		AdministeredCoursesDataSource,
		BooksDataSource,
		EnrolledCoursesDataSource,
	},
} = Models;

// collections in the 'Courses' workspace are titled
// 'AllCourses', 'EnrolledCourses', 'AdministeredCourses';
// TODO: unify/align the KEYS constants
export const KEYS = {
	administeredCourses: COLLECTION_NAMES.administeredCourses,
	courses: COLLECTION_NAMES.enrolledCourses,
	books: 'books',
	communities: 'communities',
};

const PREF_KEY_MAP = {
	[COLLECTION_NAMES.administeredCourses]: 'courses.administered',
	[COLLECTION_NAMES.enrolledCourses]: 'courses',
};

export const getPrefsSortKey = collectionName =>
	`Sort.${PREF_KEY_MAP[collectionName] ?? collectionName}`;

const defaultSortDirection = (collection, sortOn) =>
	sortOn === 'lastSeenTime' ? 'descending' : 'ascending';

const initialValues = {
	loading: true,
	error: null,
	hasSearchTerm: false,
	...Object.keys(KEYS).reduce(
		// set all collection keys to null
		(acc, key) => ({ ...acc, [key]: null }),
		{}
	),
};

class StoreClass extends Stores.BoundStore {
	constructor(options = {}) {
		super();

		this.options = {
			batchSize: 8,
			...options,
		};
		this.dispatcherID = AppDispatcher.register(this.handleDispatch);
		this.loaded = false;
		this.prevSearch = false;

		this.set({
			...initialValues,
		});

		(async () => {
			// set default sorts according to user preferences
			const prefs = await getUserPreferences();
			Object.entries(KEYS).forEach(([key, collectionName]) => {
				const sort = prefs.get(getPrefsSortKey(collectionName));
				if (sort) {
					this.stageChanges({
						[key]: {
							...sort,
							...this[key],
						},
					});
				}
			});

			// instantiate data sources
			const service = await getService();
			this.#dataSources[
				KEYS.administeredCourses
			] = new AdministeredCoursesDataSource(service);
			this.#dataSources[KEYS.courses] = new EnrolledCoursesDataSource(
				service
			);
			this.#dataSources[KEYS.books] = new BooksDataSource(service);
		})();
	}

	KEYS = KEYS;

	#dataSources = {};

	getSortOptions = collectionName => {
		return [
			...new Set([
				...([KEYS.courses, KEYS.administeredCourses].includes(
					collectionName
				)
					? ['favorites']
					: []),
				...getSortOptions(collectionName),
			]),
		].filter(o => o !== 'availability');
	};

	loaders = {
		[KEYS.communities]: async ({ searchTerm }) => {
			const term = searchTerm?.toLowerCase();
			const filterFn = !term
				? x => x
				: ({ alias, realname }) =>
						[alias, realname].some(n =>
							n?.toLowerCase().includes(term)
						);
			return getService()
				.then(service => service.getCommunities())
				.then(communities => communities.load(true))
				.then(items => items.filter(filterFn));
		},

		// originally used to fetch the courses; now it just passes the sort info through.
		// we should rework this for better clarity
		[KEYS.administeredCourses]: ({
			currentValue: {
				sortOn = 'favorites',
				sortDirection,
				batchSize = 8,
			} = {},
		}) => ({ sortOn, sortDirection, batchSize }),

		// originally used to fetch the courses; now it just passes the sort info through.
		// we should rework this for better clarity
		[KEYS.courses]: ({
			currentValue: {
				sortOn = 'favorites',
				sortDirection,
				batchSize = 8,
			} = {},
		}) => ({ sortOn, sortDirection, batchSize }),

		[KEYS.books]: async ({
			currentValue: { sortOn, sortDirection } = {},
		}) => {
			const batch = await this.#dataSources[KEYS.books].request({
				filter: this.searchTerm,
				sortOn,
				sortDirection,
			});

			const service = await getService();

			const items = await Promise.all(
				batch.titles.map(x => service.getObject(x))
			);
			return { items, sortOn, sortDirection };
		},
		admin: async () => !!(await getService()).getWorkspace('SiteAdmin'),
		hasCatalog: async () =>
			!!(await getService()).getCollection('Courses', 'Catalog'),
	};

	async loadCollection(
		title,
		workspace,
		{ batchSize = this.options.batchSize, batchStart = 0 } = {},
		preprocessor
	) {
		const service = await getService();
		const collection = service.getCollection(title, workspace);

		const { sortOn = 'favorites', sortDirection } =
			(await getUserPreferences())?.get(getPrefsSortKey(title)) || {};

		const useFavorites =
			!this.searchTerm &&
			sortOn === 'favorites' &&
			collection.hasLink('Favorites');

		const link = useFavorites
			? collection.getLink('Favorites')
			: collection.href;

		const batch = await service.getBatch(
			link,
			useFavorites
				? null
				: {
						filter: this.searchTerm,
						sortOn,
						sortDirection,
						batchStart: 0,
						batchSize,
				  }
		);

		const { Items: items = [], Total: total } =
			(await preprocessor?.(batch, service)) || batch || {};

		return {
			items,
			total,
			sortOn,
			sortDirection,
		};
	}

	runLoaders = async () => {
		const keys = Object.keys(this.loaders);
		const results = await Promise.all(
			keys.map(k =>
				this.loaders[k]({
					searchTerm: this.searchTerm,
					currentValue: this[k],
				})
			)
		);

		// map the promise results back to their keys so this returns an object
		// convenient for updating the store's values e.g. { courses: { ... }, administeredCourses: { ... }, ... }
		return keys.reduce(
			(acc, key, index) => ({
				...acc,
				[key]: results[index],
			}),
			{}
		);
	};

	handleDispatch = event => {
		const type = event && (event.type || (event.action || {}).type);

		if (type === 'catalog:redeem' || type === 'course:drop') {
			this.reload(KEYS.courses);
		}
	};

	onSortChange = async (
		collectionName,
		sortOn,
		sortDirection = defaultSortDirection(collectionName, sortOn)
	) => {
		if (!Object.values(KEYS).includes(collectionName)) {
			// throw? log a warning?
			return;
		}

		(await getUserPreferences()).set(getPrefsSortKey(collectionName), {
			sortOn,
			sortDirection,
		});

		this[collectionName] = {
			...this[collectionName],
			sortOn,
			sortDirection,
			batchStart: 0,
		};
		// console.log(collectionName, sortOn, sortDirection);
		this.reload(collectionName);
	};

	async load() {
		if (this.lastSearchTerm === this.searchTerm) {
			// console.log('skipping load', this.lastSearchTerm, this.searchTerm);
			return;
		}

		const term = (this.lastSearchTerm = this.searchTerm);

		// on each load, clear the staged queue
		this.clearStaged();
		this.set({ ...initialValues });

		try {
			const data = await this.runLoaders();

			if (term !== this.searchTerm) {
				// search changed while we were waiting.
				return;
			}

			this.set(data);

			this.loaded = true;
			this.prevSearch = false;
		} catch (e) {
			this.set({ error: e });
		} finally {
			this.set({ loading: false });
		}
	}

	async reload(key) {
		const loader = this.loaders[key];
		const currentValue = this[key];
		if (loader) {
			this.set({
				loading: true,
				error: null,
				[key]: null,
			});

			try {
				const result = await loader({ currentValue });
				this.stageChanges({ [key]: result });
			} catch (error) {
				this.stageChanges({ error });
			} finally {
				this.loaded = true;
				this.stageChanges({ loading: false });
				this.commitStaged();
			}
		}
	}

	/**
	 * Flush the staged queue (without applying the data)
	 */
	clearStaged() {
		this.staged = {};
	}

	/**
	 * Add items to be set on the store (instead of setting them immediately, which triggers an event emit)
	 *
	 * @param {Object} obj Object containing key-value pairs to eventually be set on the store
	 */
	stageChanges(obj) {
		if (!this.staged) {
			this.staged = {};
		}

		for (let key of Object.keys(obj)) {
			this.staged[key] = obj[key];
		}
	}

	/**
	 * Flush the staged queue and set the data on the store, triggering an event emit
	 */
	commitStaged() {
		this.set(this.staged);

		this.clearStaged();
	}
}

export const Store = decorate(StoreClass, [mixin(Mixins.Searchable)]);

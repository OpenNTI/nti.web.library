import { getService } from '@nti/web-client';
import { Stores, Mixins } from '@nti/lib-store';
import { decorate } from '@nti/lib-commons';
import { mixin } from '@nti/lib-decorators';
import AppDispatcher from '@nti/lib-dispatcher';

const COLLECTION_NAMES = {
	allCourses: 'AllCourses',
	enrolledCourses: 'EnrolledCourses',
	administeredCourses: 'AdministeredCourses',
};

// collections in the 'Courses' workspace are
// 'AllCourses', 'EnrolledCourses', 'AdministeredCourses';
// TODO: unify/align the KEYS constants
export const KEYS = {
	administeredCourses: COLLECTION_NAMES.administeredCourses,
	courses: COLLECTION_NAMES.enrolledCourses,
	books: 'books',
	communities: 'communities',
};

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

const FAVORITES = 'favorites';

const courseSortOptions = [
	FAVORITES,
	'createdTime',
	'provideruniqueid',
	'lastSeenTime',
	'title',
];

class HomePageStore extends Stores.BoundStore {
	constructor() {
		super();

		this.dispatcherID = AppDispatcher.register(this.handleDispatch);
		this.loaded = false;
		this.prevSearch = false;

		this.set({
			...initialValues,
		});
	}

	loaders = {
		[KEYS.communities]: async () => {
			const term = this.searchTerm?.toLowerCase();
			const filterFn = term
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
		[KEYS.administeredCourses]: () =>
			this.loadCollection(
				COLLECTION_NAMES.administeredCourses,
				'Courses',
				this[KEYS.administeredCourses] // pass current state to provide sortOn, sortDirection, etc.
			),
		[KEYS.courses]: () =>
			this.loadCollection(
				COLLECTION_NAMES.enrolledCourses,
				'Courses',
				this[KEYS.courses] // pass current state to provide sortOn, sortDirection, etc.
			),
		[KEYS.books]: () =>
			this.loadCollection(
				'VisibleContentBundles',
				'ContentBundles',
				this[KEYS.books], // pass current state to provide sortOn, sortDirection, etc.
				(batch, service) =>
					Promise.all(batch.titles.map(x => service.getObject(x))) // preprocess batch items
			),
		admin: async () => !!(await getService()).getWorkspace('SiteAdmin'),
		hasCatalog: async () =>
			!!(await getService()).getCollection('Courses', 'Catalog'),
	};

	async loadCollection(
		title,
		workspace,
		{
			sortOn = 'favorites',
			sortDirection,
			batchSize = 8,
			batchStart = 0,
		} = {},
		preprocessor
	) {
		const service = await getService();
		const collection = service.getCollection(title, workspace);
		const useFavorites =
			!this.searchTerm &&
			sortOn === FAVORITES &&
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
			nextBatch: batch.getLink('batch-next'),
		};
	}

	runLoaders = async () => {
		const keys = Object.keys(this.loaders);
		const results = await Promise.all(
			keys.map(k => this.loaders[k](this.searchTerm))
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

	getSortOptions = collectionName => [...courseSortOptions];

	onSortChange = async (
		collectionName,
		sortOn,
		sortDirection = 'ascending'
	) => {
		if (!Object.values(KEYS).includes(collectionName)) {
			// throw? log a warning?
			return;
		}

		getService()
			.then(s => s.getUserPreferences())
			.then(prefs =>
				prefs.setLibrarySort(collectionName, sortOn, sortDirection)
			);

		this[collectionName] = {
			...this[collectionName],
			sortOn,
			sortDirection,
			batchStart: 0,
			nextBatch: undefined,
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

	/**
	 * Flush the staged queue (without applying the data)
	 *
	 * @returns {null}      No return value
	 */
	clearStaged() {
		this.staged = {};
	}

	/**
	 * Add items to be set on the store (instead of setting them immediately, which triggers an event emit)
	 *
	 * @param {Object} obj Object containing key-value pairs to eventually be set on the store
	 * @returns {null}      No return value
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
	 *
	 * @returns {null}      No return value
	 */
	commitStaged() {
		this.set(this.staged);

		this.clearStaged();
	}

	async reload(key) {
		const loader = this.loaders[key];
		if (loader) {
			this.set({
				loading: true,
				error: null,
				[key]: null,
			});

			try {
				const result = await loader();
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
}

export default decorate(HomePageStore, [mixin(Mixins.Searchable)]);

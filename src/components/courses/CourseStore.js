import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';
import AppDispatcher from '@nti/lib-dispatcher';

import {getSemesterText} from '../../utils/Semester';

export default
@mixin(Mixins.Searchable)
class CourseStore extends Stores.BoundStore {
	constructor () {
		super();

		this.dispatcherID = AppDispatcher.register(this.handleDispatch);
		this.loaded = false;
		this.prevSearch = false;

		this.set({
			loading: true,
			loadArchived: false,
			error: null,
			upcomingCourses: null,
			currentCourses: null,
			archivedCourses: null,
			hasSearchTerm: false
		});
	}

	handleDispatch = (event) => {
		let type = event && (event.type || (event.action || {}).type);

		if (!type) {
			return;
		} else if (type === 'course:drop') {
			this.reloadUpcoming();
			this.reloadCurrent();

			if(this.get('archivedCourses')) {
				this.loadArchivedCourses();
			}
		}
	}

	async load () {
		if (this.searchTerm) {
			this.loaded = false;
			this.set({
				loading: true,
				loadArchived: false,
				error: null,
				upcomingCourses: null,
				currentCourses: null,
				archivedCourses: null,
				hasSearchTerm: true
			});

			this.loadSearchTerm();
		} else if (!this.loaded || this.prevSearch) {
			this.set({
				loading: true,
				loadArchived: false,
				error: null,
				upcomingCourses: null,
				currentCourses: null,
				archivedCourses: null,
				hasSearchTerm: false
			});

			try {
				const libraryPromises = [
					this.loadUpcomingCourses(),
					this.loadCurrentCourses()
				];

				await Promise.all(libraryPromises);
			} catch (e) {
				this.set('error', e);
			} finally {
				this.loaded = true;
				this.prevSearch = false;
				this.set('loading', false);
			}
		}
	}

	async loadSearchTerm () {
		const searchTerm = this.searchTerm;

		try {
			if (searchTerm !== this.searchTerm) { return; }

			await this.searchCourses(searchTerm);
		} catch (e) {
			this.set('error', e);
		} finally {
			this.loaded = true;
			this.prevSearch = true;
			this.set('loading', false);
		}
	}

	splitItemsBySemester (items) {
		const semesters = [...new Set(items.map(x => getSemesterText(x)))];
		let semesterBins = [];
		semesters.map(semester => {
			const filteredItems = items.filter(item => getSemesterText(item) === semester);

			semesterBins.push({
				semester: semester,
				courses: filteredItems.sort((a, b) => a.getCreatedTime() < b.getCreatedTime())
			});
		});

		return semesterBins;
	}

	async loadUpcomingCourses () {
		let service = await getService();
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const upcomingCourses = await service.getBatch(enrolledCollection.getLink('Upcoming'));

		if (this.searchTerm) { return; }

		this.set('upcomingCourses', upcomingCourses.Items);
	}

	async loadCurrentCourses () {
		let service = await getService();
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const currentCourses = await service.getBatch(enrolledCollection.getLink('Current'));

		if (this.searchTerm) { return; }

		this.set('currentCourses', currentCourses.Items);
	}

	async reloadUpcoming () {
		if (this.searchTerm) {
			this.loaded = false;

			this.set({
				loading: true,
				loadArchived: false,
				error: null,
				upcomingCourses: null,
				currentCourses: null,
				archivedCourses: null,
				hasSearchTerm: true
			});

			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				upcomingCourses: null
			});

			try {
				let service = await getService();
				const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

				const upcomingCourses = await service.getBatch(enrolledCollection.getLink('Upcoming'));

				this.set('upcomingCourses', upcomingCourses.Items);
			} catch (e) {
				this.set('error', e);
			} finally {
				this.set('loading', false);
			}
		}
	}

	async reloadCurrent () {
		if (this.searchTerm) {
			this.loaded = false;

			this.set({
				loading: true,
				loadArchived: false,
				error: null,
				upcomingCourses: null,
				currentCourses: null,
				archivedCourses: null,
				hasSearchTerm: true
			});

			this.loadSearchTerm();
		} else {
			this.set({
				loading: true,
				error: null,
				currentCourses: null
			});

			try {
				let service = await getService();
				const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

				const currentCourses = await service.getBatch(enrolledCollection.getLink('Current'));

				this.set('currentCourses', currentCourses.Items);
			} catch (e) {
				this.set('error', e);
			} finally {
				this.set('loading', false);
			}
		}
	}

	async loadArchivedCourses () {
		if (this.searchTerm) {
			this.loaded = false;
			this.set({
				loading: true,
				loadArchived: true,
				error: null,
				upcomingCourses: null,
				currentCourses: null,
				archivedCourses: null,
				hasSearchTerm: true
			});

			this.loadSearchTerm();
		} else {
			this.set({
				archivedCourses: null,
				loadArchived: true
			});

			try {
				let service = await getService();
				const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

				const archivedCourses = await service.getBatch(enrolledCollection.getLink('Archived'));

				this.set('archivedCourses', this.splitItemsBySemester(archivedCourses.Items));
			} catch (e) {
				this.set('error', e);
			} finally {
				this.set('loadArchived', false);
			}
		}
	}

	async searchCourses (searchTerm) {
		let service = await getService();
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');
		const coursesBatch = await service.get(enrolledCollection.href + '?filter=' + searchTerm);
		const coursesPromises = coursesBatch.Items.map(x => service.getObject(x));
		const coursesParsed = await Promise.all(coursesPromises);
		const today = new Date();
		let currentCourses = [];
		const assumeCurrent = coursesParsed.filter(y => y.getStartDate() == null || y.getEndDate() == null && !(y.getStartDate() && y.getStartDate() > today));
		currentCourses.push(...assumeCurrent);
		let currentDate = coursesParsed.filter(y => (y.getStartDate() && y.getStartDate() < today) && (y.getEndDate() && y.getEndDate() > today));
		currentCourses.push(...currentDate);

		let archivedCourses = coursesParsed.filter(y => (y.getStartDate() && y.getStartDate() < today) && (y.getEndDate() && y.getEndDate() < today));
		let upcomingCourses = coursesParsed.filter(y => (y.getStartDate() && y.getStartDate() > today));

		if (searchTerm !== this.searchTerm) { return; }

		this.set({
			'currentCourses': currentCourses,
			'archivedCourses': this.splitItemsBySemester(archivedCourses),
			'upcomingCourses': upcomingCourses
		});
	}
}

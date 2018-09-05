import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

import {getSemesterText} from '../../utils/Semester';

export default
@mixin(Mixins.Searchable)
class AdminCourseStore extends Stores.BoundStore {
	constructor () {
		super();

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

	async load () {
		this.set({
			loading: true,
			loadArchived: false,
			error: null,
			upcomingCourses: null,
			currentCourses: null,
			archivedCourses: null,
			hasSearchTerm: false
		});

		if (this.searchTerm) {
			this.set('hasSearchTerm', true);
			this.loadSearchTerm();
		} else {
			try {
				const libraryPromises = [
					this.loadUpcomingCourses(),
					this.loadCurrentCourses()
				];

				await Promise.all(libraryPromises);
			} catch (e) {
				this.set('error', e);
			} finally {
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

		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const upcomingAdminCourses = await service.getBatch(adminCollection.getLink('Upcoming'));

		this.set('upcomingCourses', upcomingAdminCourses.Items);
	}

	async loadCurrentCourses () {
		let service = await getService();

		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');

		const currentAdminCourses = await service.getBatch(adminCollection.getLink('Current'));

		this.set('currentCourses', currentAdminCourses.Items);
	}

	async reloadUpcoming () {
		this.set({
			loading: true,
			error: null,
			upcomingCourses: null
		});

		try {
			let service = await getService();
			const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
			const upcomingAdminCourses = await service.getBatch(adminCollection.getLink('Upcoming'));

			this.set('upcomingCourses', upcomingAdminCourses.Items);
		} catch (e) {
			this.set('error', e);
		} finally {
			this.set('loading', false);
		}
	}

	async reloadCurrent () {
		this.set({
			loading: true,
			error: null,
			currentCourses: null
		});

		try {
			let service = await getService();
			const adminCollection = service.getCollection('AdministeredCourses', 'Courses');

			const currentAdminCourses = await service.getBatch(adminCollection.getLink('Current'));

			this.set('currentCourses', currentAdminCourses.Items);
		} catch (e) {
			this.set('error', e);
		} finally {
			this.set('loading', false);
		}
	}

	async loadArchivedCourses () {
		this.set({
			archivedCourses: null,
			loadArchived: true
		});

		try {
			let service = await getService();

			const adminCollection = service.getCollection('AdministeredCourses', 'Courses');

			const archivedAdminCourses = await service.getBatch(adminCollection.getLink('Archived'));

			this.set('archivedCourses', this.splitItemsBySemester(archivedAdminCourses.Items));
		} catch (e) {
			this.set('error', e);
		} finally {
			this.set('loadArchived', false);
		}
	}

	async searchCourses (searchTerm) {
		let service = await getService();
		const adminCollection = service.getCollection('AdministeredCourses', 'Courses');
		const coursesBatch = await service.get(adminCollection.href + '?filter=' + searchTerm);
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

		this.set({
			'currentCourses': currentCourses,
			'archivedCourses': this.splitItemsBySemester(archivedCourses),
			'upcomingCourses': upcomingCourses
		});
	}
}

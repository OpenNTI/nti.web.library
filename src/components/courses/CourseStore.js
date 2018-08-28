import {getService} from '@nti/web-client';
import {Stores, Mixins} from '@nti/lib-store';
import {mixin} from '@nti/lib-decorators';

import {getSemesterText} from '../../utils/Semester';

@mixin(Mixins.Searchable)
export default class CourseStore extends Stores.BoundStore {
	constructor () {
		super();

		this.set({
			loading: false,
			error: null,
			upcomingCourses: null,
			currentCourses: null,
			archivedCourses: null
		});
	}

	async load () {
		this.set({
			loading: true,
			error: null,
			upcomingCourses: null,
			currentCourses: null,
			archivedCourses: null
		});

		this.emitChange('loading');

		if (this.searchTerm) {
			this.loadSearchTerm();
		} else {
			try {
				this.loadUpcomingCourses();
				this.loadCurrentCourses();
			} catch (e) {
				this.set('error', e);
				this.emitChange('error');
			} finally {
				this.set('loading', false);
				this.emitChange('loading');
			}
		}
	}

	loadSearchTerm () {
		const searchTerm = this.searchTerm;

		try {
			if (searchTerm !== this.searchTerm) { return; }

			this.searchCourses(searchTerm);
		} catch (e) {
			this.set('error', e);
			this.emitChange('error');
		} finally {
			this.set('loading', false);
			this.emitChange('loading');
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

		this.set('upcomingCourses', upcomingCourses.Items);

		this.emitChange();
	}

	async loadCurrentCourses () {
		let service = await getService();
		const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

		const currentCourses = await service.getBatch(enrolledCollection.getLink('Current'));

		this.set('currentCourses', currentCourses.Items);

		this.emitChange();
	}

	async loadArchivedCourses () {
		this.set({
			loading: true
		});

		try {
			let service = await getService();
			const enrolledCollection = service.getCollection('EnrolledCourses', 'Courses');

			const archivedCourses = await service.getBatch(enrolledCollection.getLink('Archived'));

			this.set('archivedCourses', this.splitItemsBySemester(archivedCourses.Items));

			this.emitChange();
		} catch (e) {
			this.set('error', e);
			this.emitChange('error');
		} finally {
			this.set('loading', false);
			this.emitChange('loading');
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
		const assumeCurrent = coursesParsed.filter(y => y.getStartDate() == null || y.getEndDate() == null);
		currentCourses.push(...assumeCurrent);
		let currentDate = coursesParsed.filter(y => (y.getStartDate() && y.getStartDate() < today) && (y.getEndDate() && y.getEndDate() > today));
		currentCourses.push(...currentDate);

		let archivedCourses = coursesParsed.filter(y => (y.getStartDate() && y.getStartDate() < today) && (y.getEndDate() && y.getEndDate() < today));
		let upcomingCourses = coursesParsed.filter(y => (y.getStartDate() && y.getStartDate() > today));

		this.set('currentCourses', currentCourses);
		this.set('archivedCourses', this.splitItemsBySemester(archivedCourses));
		this.set('upcomingCourses', upcomingCourses);

		this.emitChange();
	}
}

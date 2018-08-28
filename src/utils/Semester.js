const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export function getEffectiveDate (course) {
	// if there is no start date, but we have an end date, consider that end date
	// as the 'effective' date for the course.  So when determining which semester an archived
	// course occurred, basing it on the EndDate is our only option without a StartDate
	return course.getStartDate() || course.getEndDate();
}

export function getSemester (course) {
	let start = getEffectiveDate(course),
		month = start && start.getMonth(),
		s = start && months[month];
	return s || '';
}

export function  getSemesterText (course) {
	let start = getEffectiveDate(course),
		year = start && start.getFullYear(),
		semester = getSemester(course);

	if (!start) {
		return '';
	}

	return semester + ' ' + year;
}

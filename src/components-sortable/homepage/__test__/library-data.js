const n = x =>
	`tag:nextthought.com,2011-10:landon.sherwood-OID-0x1488cb:5573657273:${x}`;

const mockCourse = ({ NTIID, ...props }) => ({
	title: 'Test Course',
	isCourse: true,
	NTIID: n(NTIID),
	MimeType: 'application/vnd.nextthought.courseware.courseinstanceenrollment',
	getStartDate: () => {},
	getEndDate: () => {},
	CatalogEntry: {
		CourseNTIID: n(NTIID),
		getStartDate: () => {},
		getEndDate: () => {},
		getAuthorLine: () => {},
		getDefaultAssetRoot: () => {},
	},
	...props,
});

export default {
	communities: [
		{
			ID: 'ou.nextthought.com',
			Username: 'ou.nextthought.com',
			alias: 'OU',
			isCommunity: true,
			NTIID:
				'tag:nextthought.com,2011-10:system-NamedEntity:Community-ou.nextthought.com',
		},
	],

	EnrolledCourses: {
		Items: [
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
		].map(mockCourse),
	},

	AdministeredCourses: {
		Items: [
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
		].map(mockCourse),
	},

	books: {
		items: [
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
		],
	},
};

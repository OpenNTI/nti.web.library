
import { Card } from '@nti/web-course';

const Course = ({ item, ...props }) => <Card course={item} {...props} />;
Course.handles = item => item?.isCourse;

export default Course;

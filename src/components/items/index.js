import './index.scss';
import Bundle from './Bundle';
import Community from './Community';
import Course from './Course';

const WIDGETS = [Bundle, Community, Course];

export default function getItem(item) {
	return WIDGETS.find(widget => widget.handles?.(item));
}

import './index.scss';
import Bundle from './Bundle';
import Community from './Community';
import Course from './Course';

const WIDGETS = [Bundle, Community, Course];

export default function getItem (item) {

	for (let widget of WIDGETS) {
		if (widget.handles && widget.handles(item)) {
			return widget;
		}
	}

}

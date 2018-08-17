//`require.context` is a little WebPack magic :) --- dynamicly require all files the match the pattern /.js(x?)$/
const req = require.context('./', false, /\.js(x?)$/); //gather
const WIDGETS = req.keys().map(m => req(m).default); //require/invoke all

export default function getItem (item) {

	for (let widget of WIDGETS) {
		if (widget.handles(item)) {
			return widget;
		}
	}

}

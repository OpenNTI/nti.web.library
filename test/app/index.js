import React from 'react';
import ReactDOM from 'react-dom';

import {View} from '../../src/';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<View />,
	document.getElementById('content')
);

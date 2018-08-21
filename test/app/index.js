import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from '@nti/lib-dom';

import {View} from '../../src/';

addFeatureCheckClasses();

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<View />,
	document.getElementById('content')
);

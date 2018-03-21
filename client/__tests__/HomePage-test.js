import React from 'react';
import {shallow} from 'enzyme';
import UserPage from '../components/UserPage';
import { has } from 'lodash'
import moment from 'moment'
import HomePage from '../components/HomePage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if HomePage exists
test('Check to see if HomePage exists', () => {

  	const home = shallow(
	  	<HomePage />
    );
	expect(home.contains('HomePage'));
});
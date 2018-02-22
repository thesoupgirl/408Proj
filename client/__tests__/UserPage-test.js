import React from 'react';
import {shallow} from 'enzyme';
import UserPage from '../components/UserPage';
import BigCalendar from 'react-big-calendar'
import { has } from 'lodash'
import moment from 'moment'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if big calendar exists
test('Check to see if big calendar exists', () => {

  	const page = shallow(
	  	<UserPage />
    );
	expect(page.contains('BigCalendar'));
});





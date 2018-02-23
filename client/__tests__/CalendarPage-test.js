import React from 'react';
import {shallow} from 'enzyme';
import UserPage from '../components/UserPage';
import BigCalendar from 'react-big-calendar'
import { has } from 'lodash'
import moment from 'moment'
import CalendarPage from '../components/CalendarPage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if Google button exists
test('Check to see if Google button exists', () => {

  	const googleButton = shallow(
	  	<CalendarPage />
    );
	googleButton.simulate('click');
	expect(googleButton.contains('Google'));
});

//tests to see if Outlook button exists
test('Check to see if Outlook button exists', () => {

  	const outlookButton = shallow(
	  	<CalendarPage />
    );
	outlookButton.simulate('click');
	expect(outlookButton.contains('Outlook'));
});
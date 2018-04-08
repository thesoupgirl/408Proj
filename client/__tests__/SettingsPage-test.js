import React from 'react';
import {shallow} from 'enzyme';
import UserPage from '../components/UserPage';
import { has } from 'lodash'
import moment from 'moment'
import SettingsPage from '../components/SettingsPage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if SettingsPage exists
test('Check to see if SettingsPage exists', () => {

  	const settings = shallow(
	  	<SettingsPage />
    );
    
	expect(settings.contains('SettingsPage'));
});
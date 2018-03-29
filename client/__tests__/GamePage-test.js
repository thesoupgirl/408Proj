import React from 'react';
import {shallow} from 'enzyme';
import UserPage from '../components/UserPage';
import { has } from 'lodash'
import moment from 'moment'
import Games from '../components/Games';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if Game exists
test('Check to see if Game exists', () => {

  	const gamePage = shallow(
	  	<Games />
    );
	expect(gamePage.contains('Games'));
});
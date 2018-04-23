import React from 'react';
import {shallow} from 'enzyme';
import ApplicationGuide from '../components/ApplicationGuide';
import { has } from 'lodash'
import moment from 'moment'


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if Application Guide exists
test('Check to see if ApplicationGuide exists', () => {

  	const home = shallow(
	  	<ApplicationGuide />
    );
    
	expect(home.contains('ApplicationGuide'));
});
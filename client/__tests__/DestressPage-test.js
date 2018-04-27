import React from 'react';
import {shallow} from 'enzyme';
import DestressPage from '../components/DestressPage';
import { has } from 'lodash'
import moment from 'moment'


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if Destress Page exists
test('Check to see if Destress Page exists', () => {

  	const home = shallow(
	  	<DestressPage />
    );
    
	expect(home.contains('DestressPage'));
});
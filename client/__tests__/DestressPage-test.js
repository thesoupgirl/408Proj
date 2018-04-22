import React from 'react';
import {shallow} from 'enzyme';
import ImportPage from '../components/DestressPage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if HomePage exists
test('Check to see if DestressPage exists', () => {

  	const home = shallow(
	  	<DestressPage />
    );
    
	expect(home.contains('DestressPage'));
});
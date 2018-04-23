import React from 'react';
import {shallow} from 'enzyme';
import ImportPage from '../components/ImportPage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if Application Guide exists
test('Check to see if Destress Page exists', () => {

  	const home = shallow(
	  	<DestressPage />
    );
    
	expect(home.contains('DestressPage'));
});
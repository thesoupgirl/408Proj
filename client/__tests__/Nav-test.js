import React from 'react';
import {shallow} from 'enzyme';
import Navigation from '../components/Navigation';
import {AdviceProvider} from '../components/AdviceProvider.jsx'


// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//tests to see if navigation renders correctly
test('Renders navigation correctly', () => {
  const tree = renderer.create(
    <Navigation />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

//regression tests to see if active view is created
test('Regression tests for active view', () => {
    const nav = shallow(
	  	<Navigation />
    );
  expect(nav.contains('activeView'));
});

test('Regression tests for panic button', () => {
    const nav = shallow(
        <Navigation />
    );
    expect(nav.contains('PANIC'));
});

// Adding loading test here because it kind of counts for navigation
test('Test for navigation advice', () => {
    const advice = AdviceProvider();
    // Ensure it contains a quote and a hyphen
    expect(advice.contains('"'));
    expect(advice.contains('-'));
});
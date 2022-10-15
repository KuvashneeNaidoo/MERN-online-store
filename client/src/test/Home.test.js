// Imported React libraries.
import React from 'react';
// I have also imported the react-test-renderer needed to render snapshots.
import renderer from 'react-test-renderer';
// The Home.js file has been imported for testing.
import Home from '../components/Home/Home';

it('renders without crashing?', () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});

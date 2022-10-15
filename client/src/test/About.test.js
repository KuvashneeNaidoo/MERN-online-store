// Imported React libraries.
import React from 'react';
// I have also imported the react-test-renderer needed to render snapshots.
import renderer from 'react-test-renderer';
// The About.js file has been imported for testing.
import About from '../components/about/About';

/* To perform a snapshot test, we will construct a tree variable that contains the DOM tree of the 
rendered component <About /> which is in JSON format. expect(domTree).toMatchSnapshot() will create a 
snapshot of which will be saved. In order to return a JSON object of the rendered DOM tree as a snapshot, 
the .toJSON() method is used. */
it('renders without crashing?', () => {
  const tree = renderer.create(<About />).toJSON();
  expect(tree).toMatchSnapshot();
});

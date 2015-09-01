/* eslint no-unused-expressions:0 */
import React from 'react/addons';
import App from '../../src/components/App';
import {RouteHandler} from 'react-router';
import * as utils from '../utils';

const {TestUtils} = React.addons;
describe('Components', () => {
  describe('App', () => {
    const component = utils.shallowlyRenderedOutput(<App />);

    it('should have a div as container', () => {
      expect(component.type).to.equal('div');
    });

    it('should contain a RouteHandler', () => {
      expect(TestUtils.isElementOfType(component.props.children, RouteHandler)).to.be.true;
    });
  });
});

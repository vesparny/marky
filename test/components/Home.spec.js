/* eslint no-unused-expressions:0 */
import React from 'react/addons';
import Home from '../../src/components/Home';
import * as utils from '../utils';
import {version} from '../../package.json';

describe('Components', () => {
  describe('Home', () => {
    const component = utils.shallowlyRenderedOutput(< Home / >);
    it('should contain one "<section>" element', () => {
      expect(component.type).to.be.equal('section');
    });

    it('should contain a link to my twitter account', () => {
      expect(component.props.children.props.children).to.contain(
        <a href ="https://twitter.com/vesparny">@vesparny</a>);
    });

    describe('getVersion', () => {
      it('should return the current version when called', () => {
        const currentVersion = Home.prototype.getVersion();
        expect(currentVersion).to.be.equal(version);
      });
    });

    describe('increment', () => {
      it('should call setState() once invoked', () => {
        const spy = sinon.spy();
        Home.prototype.increment.call({
          state: {
            counter: 0
          },
          setState: spy
        });
        expect(spy).to.have.been.calledOnce;
      });
    });
  });
});

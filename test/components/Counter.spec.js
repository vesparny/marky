/* eslint no-unused-expressions:0 */
import React from 'react/addons';
import Counter from '../../src/components/Counter';
import jsdom from 'mocha-jsdom';

const {TestUtils} = React.addons;

describe('Components', () => {
  jsdom();
  describe('Counter', () => {
    // Mock minimal Home interface
    const Home = React.createClass({

      getInitialState() {
        return {
          counter: 0
        };
      },

      increment() {
        this.setState({
          counter: this.state.counter += 1
        });
      },

      render() {
        return (
          <div>
            <Counter
              count={this.state.counter}
              onIncrement={this.increment.bind(this)}
            />
          </div>
        );
      }
    });

    it('should receive and increment counter', () => {
      const tree = TestUtils.renderIntoDocument(<Home />);
      const counter = TestUtils.findRenderedComponentWithType(tree, Counter);
      TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithTag(counter, 'a'));
      expect(counter.props.count).to.be.equal(1);
      expect(TestUtils.findRenderedDOMComponentWithTag(counter, 'h1').getDOMNode().textContent)
        .to.contain('1');
    });

    describe('increment', () => {
      it('should get called when a click on button happens', () => {
        const spy = sinon.spy();
        const counter = TestUtils.renderIntoDocument(<Counter onIncrement={spy} count={0} />);
        const button = TestUtils.findRenderedDOMComponentWithTag(counter, 'a');
        TestUtils.Simulate.click(button);
        expect(spy).to.have.been.calledOnce;
      });
    });
  });
});

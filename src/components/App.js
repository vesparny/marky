import React, {PropTypes} from 'react';
import {RouteHandler} from 'react-router';

const App = React.createClass({

  propTypes: {
    pathname: PropTypes.string.isRequired
  },

  render() {
    const {pathname} = this.props;

    return (
      <div>
        <RouteHandler {...this.props} key={pathname} />
      </div>
    );
  }
});

export default App;

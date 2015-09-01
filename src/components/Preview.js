import React, {PropTypes} from 'react';

const Preview = React.createClass({

  propTypes: {
    value: PropTypes.string
  },

  render: function() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.value }} />
    );
  }
});

export default Preview;

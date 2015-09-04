import React, {PropTypes} from 'react';

const Preview = React.createClass({

  propTypes: {
    value: PropTypes.string
  },

  shouldComponentUpdate(newProps) {
    return newProps.value !== this.props.value;
  },

  render() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.props.value}} />
    );
  }
});

export default Preview;

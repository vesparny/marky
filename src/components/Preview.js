import React, {PropTypes} from 'react'

const Preview = React.createClass({

  propTypes: {
    value: PropTypes.string
  },

  shouldComponentUpdate (newProps) {
    return newProps.value !== this.props.value
  },

  render () {
    return (
      <div style={{padding: '0 15px'}}>
        <div dangerouslySetInnerHTML={{__html: this.props.value}} />
      </div>
    )
  }
})

export default Preview

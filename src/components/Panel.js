import React, {PropTypes} from 'react'
import classnames from 'classnames'
import {StyleSheet, css} from 'aphrodite'

const Panel = React.createClass({
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.string,
    overflowY: PropTypes.bool
  },

  render () {
    const cssClasses = classnames({
      [css(style.common)]: true,
      [css(style.overflowScroll)]: !this.props.overflowY,
      [css(style.overflowYScroll)]: this.props.overflowY
    })

    return (
      <div className={cssClasses}>
        {this.props.children}
      </div>
    )
  }
})

const style = StyleSheet.create({
  common: {
    height: 'calc(100vh - 90px)'
  },

  overflowYScroll: {
    overflow: 'scroll',
    paddingLeft: '10px'
  },

  overflowScroll: {
    overflow: 'scroll'
  }
})

export default Panel

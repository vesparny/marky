import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import ace from 'brace'
import 'brace/mode/markdown'
import 'brace/theme/github'
import 'brace/ext/searchbox'
import { noop } from 'lodash'

const Editor = React.createClass({
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.string
  },

  getDefaultProps () {
    return {
      onChange: noop,
      value: ''
    }
  },

  componentDidMount () {
    this.editor = ace.edit(ReactDom.findDOMNode(this))
    this.editor.$blockScrolling = Infinity
    this.editor.getSession().setMode('ace/mode/markdown')
    this.editor.getSession().setUseWrapMode(true)
    this.editor.setTheme('ace/theme/github')
    this.editor.setFontSize(14)
    this.editor.on('change', this.onChange)
    this.editor.setValue(this.props.value, -1)
    this.editor.setOption('maxLines', 99999)
    this.editor.setOption('minLines', 50)
    this.editor.setOption('highlightActiveLine', true)
    this.editor.setShowPrintMargin(false)
    this.editor.focus()
    // FIXME
    this.interval = setInterval(() => this.editor.resize(), 100)
  },

  componentWillReceiveProps (nextProps) {
    if (this.editor.getValue() !== nextProps.value) {
      this.editor.setValue(nextProps.value, -1)
    }
  },

  componentWillUnmount () {
    this.editor.destroy()
    clearInterval(this.interval)
  },

  onChange () {
    this.props.onChange(this.editor.getValue())
  },

  render () {
    return (
      <div onChange={this.onChange} />
    )
  }
})

export default Editor

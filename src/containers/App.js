import React, { PropTypes } from 'react'
import ReactDom from 'react-dom'
import {connect} from 'react-redux'
import {debounce} from 'lodash'
import {convertMarkdown, toggleScrolling} from '../actions'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import SplitPane from 'react-split-pane'
import Panel from '../components/Panel'
import Header from '../components/Header'

const App = React.createClass({

  propTypes: {
    isScrolling: PropTypes.bool,
    markdown: PropTypes.string,
    html: PropTypes.string
  },

  componentDidMount () {
    const editor = ReactDom.findDOMNode(this.refs.editor)
    const preview = ReactDom.findDOMNode(this.refs.preview)
    this.onEditorScroll = this.sync(editor, preview, 'editor')
    this.onPreviewScroll = this.sync(preview, editor, 'preview')

    if (this.props.isScrolling) {
      this.bindEvents()
    }
  },

  componentWillReceiveProps (props) {
    if (props.isScrolling) {
      this.unbindEvents()
      this.bindEvents()
    } else {
      this.unbindEvents()
    }
  },

  sync (target, other, scrollingElName) {
    return () => {
      const notScrollingElHandler = scrollingElName === 'preview'
        ? this.onEditorScroll
        : this.onPreviewScroll
      const percentage = (target.scrollTop * 100) / (target.scrollHeight - target.offsetHeight)
      other.removeEventListener('scroll', notScrollingElHandler)
      other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight) / 100
      setTimeout(() => other.addEventListener('scroll', notScrollingElHandler), 20)
    }
  },

  bindEvents () {
    ReactDom.findDOMNode(this.refs.editor).addEventListener('scroll', this.onEditorScroll)
    ReactDom.findDOMNode(this.refs.preview).addEventListener('scroll', this.onPreviewScroll)
  },

  unbindEvents () {
    ReactDom.findDOMNode(this.refs.editor).removeEventListener('scroll', this.onEditorScroll)
    ReactDom.findDOMNode(this.refs.preview).removeEventListener('scroll', this.onPreviewScroll)
  },

  onChange (value) {
    if (this.debouncedChange) {
      this.debouncedChange(value)
    } else {
      this.debouncedChange = debounce(this.props.convertMarkdown, 10)
      this.debouncedChange(value)
    }
  },

  toggleScrolling () {
    this.props.toggleScrolling()
  },

  render () {
    const {wordCount, markdown, html, fileName} = this.props
    return (
      <section>
        <Header wordCount={wordCount} fileName={fileName} />
        <SplitPane split='vertical' defaultSize='50%' primary='second'>
          <Panel ref='editor'>
            <Editor value={markdown} onChange={this.onChange} />
          </Panel>
          <Panel ref='preview' overflowY>
            <Preview value={html} />
          </Panel>
        </SplitPane>
      </section>
    )
  }
})

function mapStateToProps ({markdown}) {
  return markdown
}

export default connect(mapStateToProps, {
  convertMarkdown,
  toggleScrolling
})(App)

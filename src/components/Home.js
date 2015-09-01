import React from 'react';
import markdown from 'markdown-it';
import Editor from './Editor';
import Preview from './Preview';
import hljs from 'highlight.js'
import {debounce, memoize} from 'lodash';
import defaultMd from '../default.md';

const parser = markdown({
  html: true,
  typographer: true
}).use(require('markdown-it-highlightjs'));

let isScrolling = false;
const Home = React.createClass({

  getInitialState() {
    return {
      markdown: defaultMd,
      html: ''
    };
  },

  componentDidMount() {
    const debouncedEditorScrollHandler = debounce(this.onPaneScroll.bind(this, 'editor'), 10);
    const debouncedPreviewScrollHandler = debounce(this.onPaneScroll.bind(this, 'preview'), 10);
    const bindEvents = (targetElRefName) => () => {
      const scrollHandler = targetElRefName === 'editor' ? debouncedEditorScrollHandler : debouncedPreviewScrollHandler;
      // unbind all
      React.findDOMNode(this.refs.editor).removeEventListener('scroll', debouncedEditorScrollHandler)
      React.findDOMNode(this.refs.preview).removeEventListener('scroll', debouncedPreviewScrollHandler)
      // bind right one
      React.findDOMNode(this.refs[targetElRefName]).addEventListener('scroll', scrollHandler)
    }



    hljs.initHighlightingOnLoad();
    ['mouseenter', 'touchstart'].forEach((evt) => {
      React.findDOMNode(this.refs.preview).addEventListener(evt, bindEvents('preview'));
      React.findDOMNode(this.refs.editor).addEventListener(evt, bindEvents('editor'));
    });
  },

  onChange(value) {
    this.setState({
      markdown: value,
      html: parser.render(value)
    });
  },

  onPaneScroll(targetElRefName) {
      const otherRefName = targetElRefName === 'editor' ? 'preview': 'editor';
      const target = React.findDOMNode(this.refs[targetElRefName]);
      const other = React.findDOMNode(this.refs[otherRefName]);
      const percentage = (target.scrollTop * 100) / (target.scrollHeight - target.offsetHeight);
      other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight) / 100;
  },

  render() {

    return (
      <section>
        <div
          ref="editor"
          className="col col-6"
          style={{height: '100vh',  overflowY: 'scroll'}}
        >
        <Editor
          value={this.state.markdown}
          onChange={this.onChange}
        />
        </div>
        <div
          ref="preview"
          className="preview col col-6"
          style={{height: '100vh', overflow: 'scroll'}}
        >
        <Preview
          value={this.state.html}
        />
        </div>
      </section>
    );
  }
});

export default Home;

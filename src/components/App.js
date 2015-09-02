import React from 'react';
import Editor from './Editor';
import Preview from './Preview';
import Panel from './Panel';
import hljs from 'highlight.js'
import {debounce} from 'lodash';

import defaultMd from '../default.md';
import parser from '../parser';

const Home = React.createClass({

  getInitialState() {
    return {
      markdown: defaultMd,
      html: ''
    };
  },

  componentDidMount() {
    const editor = React.findDOMNode(this.refs.editor)
    const preview = React.findDOMNode(this.refs.preview)
    const debouncedEditorScrollHandler = debounce(this.onPaneScroll.bind(this, 'editor'), 10);
    const debouncedPreviewScrollHandler = debounce(this.onPaneScroll.bind(this, 'preview'), 10);
    const bindEvents = (targetElRefName) => () => {
      const scrollHandler = targetElRefName === 'editor' ? debouncedEditorScrollHandler : debouncedPreviewScrollHandler;
      // unbind all
      editor.removeEventListener('scroll', debouncedEditorScrollHandler)
      preview.removeEventListener('scroll', debouncedPreviewScrollHandler)
      // bind right one
      React.findDOMNode(this.refs[targetElRefName]).addEventListener('scroll', scrollHandler)
    }

    hljs.initHighlightingOnLoad();
    ['mousemove', 'touchstart', 'click'].forEach((evt) => {
      preview.addEventListener(evt, bindEvents('preview'));
      editor.addEventListener(evt, bindEvents('editor'));
    });
    // start binding events
    preview.click();
    editor.click();
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
        <header className="white bg-blue flex flex-center" style={{height: '50px'}}>
          <h3 className="ml1 mr0 mt0 mb0">Marky</h3>
        </header>
        <Panel ref="editor">
          <Editor
            value={this.state.markdown}
            onChange={this.onChange}
          />
        </Panel>
        <Panel ref="preview">
          <Preview
            value={this.state.html}
          />
        </Panel>
      </section>
    );
  }
});

export default Home;

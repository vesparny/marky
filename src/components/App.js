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
    console.log('a')
    const editor = React.findDOMNode(this.refs.editor)
    const preview = React.findDOMNode(this.refs.preview)
    const editorScrollHandler = this.onPaneScroll.bind(this, 'editor');
    const previewScrollHandler = this.onPaneScroll.bind(this, 'preview');
    const bindEvents = (targetElRefName) => () => {
      console.log(targetElRefName)

      const scrollHandler = targetElRefName === 'editor' ? editorScrollHandler : previewScrollHandler;
      // unbind other
      targetElRefName === 'editor' ?
        preview.removeEventListener('scroll', previewScrollHandler) :
        editor.removeEventListener('scroll', editorScrollHandler)
      // bind right one
      React.findDOMNode(this.refs[targetElRefName]).addEventListener('scroll', scrollHandler)
    }
    hljs.initHighlightingOnLoad();
    ['mousemove', 'touchstart', 'click'].forEach((evt) => {
      editor.addEventListener(evt, bindEvents('editor'));
      preview.addEventListener(evt, bindEvents('preview'));
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
        <Panel ref="preview" overflowY>
          <Preview
            value={this.state.html}
          />
        </Panel>
      </section>
    );
  }
});

export default Home;

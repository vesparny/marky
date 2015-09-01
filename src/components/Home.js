import React from 'react';
import markdown from 'markdown-it';
import Editor from './Editor';
import Preview from './Preview';
import hljs from 'highlight.js'
import {debounce} from 'lodash';
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
    var o = debounce(this.onEditorScroll, 10);
    var t = debounce(this.onPreviewScroll, 10);
    var a = () => {
      console.log('ok')
      React.findDOMNode(this.refs.editor).removeEventListener('scroll', o)
      React.findDOMNode(this.refs.preview).removeEventListener('scroll', t)
      React.findDOMNode(this.refs.editor).addEventListener('scroll', o)
    };

    var b = () => {
      console.log('ok')
      React.findDOMNode(this.refs.editor).removeEventListener('scroll', o)
      React.findDOMNode(this.refs.preview).removeEventListener('scroll', t)
      React.findDOMNode(this.refs.preview).addEventListener('scroll', t)
    };

    hljs.initHighlightingOnLoad();
    React.findDOMNode(this.refs.preview).addEventListener('mouseenter', b);

    React.findDOMNode(this.refs.editor).addEventListener('mouseenter', a);

  },

  onChange(value) {
    this.setState({
      markdown: value,
      html: parser.render(value)
    })
  },
  onPreviewScroll(e, elRef) {
    console.log('bbb')

      const target = React.findDOMNode(this.refs.preview);
      const other = React.findDOMNode(this.refs.editor);
      const percentage = (target.scrollTop * 100) / (target.scrollHeight - target.offsetHeight);
      other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight) / 100;

  },
  onEditorScroll(e, elRef) {
    console.log('aaa')
    const target = React.findDOMNode(this.refs.editor);
    const other = React.findDOMNode(this.refs.preview);
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

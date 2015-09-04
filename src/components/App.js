import React, {PropTypes} from 'react';
import Editor from './Editor';
import Preview from './Preview';
import Panel from './Panel';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce} from 'lodash';
import * as actions from '../actions';
import createPermalink from '../createPermalink';

const App = React.createClass({

  propTypes: __DEV__ && {
    isScrolling: PropTypes.bool,
    markdown: PropTypes.string,
    html: PropTypes.string
  },

  componentDidMount() {
    const editor = React.findDOMNode(this.refs.editor);
    const preview = React.findDOMNode(this.refs.preview);
    this.onEditorScroll = this.sync(editor, preview, 'editor');
    this.onPreviewScroll = this.sync(preview, editor, 'preview');

    if (this.props.isScrolling) {
      this.bindEvents();
    }
  },

  componentWillReceiveProps(props) {
    if (props.isScrolling) {
      this.unbindEvents();
      this.bindEvents();
    }else {
      this.unbindEvents();
    }
  },

  sync(target, other, scrollingElName) {
    return () => {
      const notScrollingElHandler = scrollingElName === 'preview' ?
        this.onEditorScroll :
        this.onPreviewScroll;
      const percentage = (target.scrollTop * 100) / (target.scrollHeight - target.offsetHeight);
      other.removeEventListener('scroll', notScrollingElHandler);
      other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight) / 100;
      setTimeout(() => other.addEventListener('scroll', notScrollingElHandler), 20);
    };
  },

  bindEvents() {
    React.findDOMNode(this.refs.editor).addEventListener('scroll', this.onEditorScroll);
    React.findDOMNode(this.refs.preview).addEventListener('scroll', this.onPreviewScroll);
  },

  unbindEvents() {
    React.findDOMNode(this.refs.editor).removeEventListener('scroll', this.onEditorScroll);
    React.findDOMNode(this.refs.preview).removeEventListener('scroll', this.onPreviewScroll);
  },

  onChange(value) {
    if (this.debouncedChange) {
      this.debouncedChange(value);
    }else {
      this.debouncedChange = debounce(this.props.convertMarkdown, 10);
      this.debouncedChange(value);
    }
  },

  createPermalink() {
    const {markdown, isScrolling} = this.props;
    createPermalink({markdown, isScrolling});
  },

  reset() {
    this.props.reset();
  },

  toggleScrolling() {
    this.props.toggleScrolling();
  },

  render() {
    return (
      <section className="clearfix">
        <header className="white bg-silver flex flex-center" style={{height: '50px'}}>
          <h3 className="flex flex-auto ml1 mr0 mt0 mb0 blue">Marky</h3>
          <div className="flex ">
            <button className="btn btn-primary mr1 ml1 bg-orange" onClick={this.createPermalink}>permalink</button>
            <button className="btn btn-primary mr1 ml1 bg-orange" onClick={this.reset}>reset</button>
            <button className="btn btn-primary mr1 ml1 bg-orange" onClick={this.toggleScrolling}>
              {this.props.isScrolling ?
               'disable scrolling' :
               'enable scrolling'
              }
            </button>
            <a href="https://github.com/vesparny/marky" className="btn btn-primary mr1 ml1 bg-blue">GitHub</a>
          </div>
        </header>
        <Panel ref="editor">
          <Editor
            value={this.props.markdown}
            onChange={this.onChange}
          />
        </Panel>
        <Panel ref="preview" overflowY>
          <Preview
            value={this.props.html}
          />
        </Panel>
      </section>
    );
  }
});

function mapStateToProps(state) {
  return state.marky;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

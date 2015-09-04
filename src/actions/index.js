import * as types from '../constants';
import parser from '../parser';

function updateMarkdown(md) {
  localStorage.setItem('__MARKY__', md);

  return {
    type: types.MARKDOWN_CHANGED,
    payload: {
      html: parser.render(md),
      markdown: md
    }
  };
}

export function convertMarkdown(md) {
  return updateMarkdown(md);
}

export function reset() {
  const md = require('../default.md');

  return updateMarkdown(md);
}

export function toggleScrolling() {
  return {
    type: types.TOGGLE_SCROLLING,
    payload: null
  };
}

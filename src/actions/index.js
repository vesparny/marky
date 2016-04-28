import * as types from '../constants/actionTypes'
import parser from '../parser'

function updateMarkdown (markdown = '') {
  return {
    type: types.MARKDOWN_CHANGED,
    payload: {
      html: parser.render(markdown),
      markdown
    }
  }
}

export function convertMarkdown (markdown) {
  return updateMarkdown(markdown)
}

export function fileLoaded ({fileName, filePath}) {
  return {
    type: types.FILE_LOADED,
    payload: {
      fileName,
      filePath
    }
  }
}

export function toggleScrolling () {
  return {
    type: types.TOGGLE_SCROLLING
  }
}

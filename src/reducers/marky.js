import * as types from '../constants';

export default function marky(state = null, action) {
  switch (action.type) {
  case types.MARKDOWN_CHANGED: {
    return Object.assign({}, state, {
      markdown: action.payload.markdown,
      html: action.payload.html
    });
  }
  case types.TOGGLE_SCROLLING: {
    return Object.assign({}, state, {
      isScrolling: !state.isScrolling
    });
  }
  default: {
    return state;
  }
  }
}

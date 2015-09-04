import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';

export default function configureStore(initialState) {
  const logger = require('redux-logger')({
    level: 'info',
    collapsed: false
  });
  let store;

  if (__DEV__) {
    const createStoreWithMiddleware = applyMiddleware(
      logger
    )(createStore);
    store = createStoreWithMiddleware(reducer, initialState);
  } else {
    store = createStore(reducer, initialState);
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

import 'babel/polyfill';
import 'basscss/css/basscss.css';
import 'highlight.js/styles/github.css';
import './style.css';
import React from 'react';
import attachFastClick from 'fastclick';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import App from './components/App';
import defaultMd from './default.md';
import qs from 'query-string';

// Remove 300ms tap delay on mobile devices
attachFastClick.attach(document.body);

// Expose globally
window.React = React;

let marky = {
  markdown: window.localStorage.getItem('__MARKY__') || defaultMd,
  html: '',
  isScrolling: true
};

if (window.location.hash) {
  const parsedState = qs.parse(window.location.hash);
  marky = {
    markdown: parsedState.markdown || defaultMd,
    html: '',
    isScrolling: parsedState.isScrolling === 'true'
  };
}

const store = configureStore({marky});

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  document.getElementById('root'));

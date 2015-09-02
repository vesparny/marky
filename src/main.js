import 'babel/polyfill';
import 'basscss/css/basscss.css';
import 'highlight.js/styles/github.css'
import './style.css'
import React from 'react';
import attachFastClick from 'fastclick';
import App from './components/App';

// Remove 300ms tap delay on mobile devices
attachFastClick.attach(document.body);

// Expose globally
window.React = React;

React.render(<App />,
  document.getElementById('root'));

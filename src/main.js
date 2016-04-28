import 'highlight.js/styles/github.css'
import 'normalize.css/normalize.css'
import './style.css'
import RedBox from 'redbox-react'
import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './configureStore'
import Root from './containers/Root'
import configureIpcRenderer from './configureIpcRenderer'

const rootElement = document.getElementById('root')

const store = configureStore()

configureIpcRenderer(store)

let render = () => {
  const Root = require('./containers/Root').default
  ReactDOM.render(
    <Root store={store} />,
    rootElement
  )
}

if (module.hot) {
  const renderApp = render
  const renderError = (err) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={err} />,
      rootElement
    )
  }
  render = () => {
    try {
      renderApp()
    } catch (err) {
      renderError(err)
    }
  }
  module.hot.accept('./containers/Root', render)
}

render()

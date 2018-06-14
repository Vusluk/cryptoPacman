import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'

import moment from 'moment'
import 'moment/locale/ru'

import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'
import { AppContainer } from 'react-hot-loader'

import store from 'store'
import Root from 'Root'

import 'styles/index.css'

const history = syncHistoryWithStore(browserHistory, store)

const container = document.getElementById('container')

moment.locale('ru')

ReactDOM.render(
  <AppContainer>
    <Root {...{ store, history }} />
  </AppContainer>,
  container
)

if (module.hot) {
  module.hot.accept('Root', () => {
    const NextRoot = require('Root').default
    ReactDOM.render(
      <AppContainer>
        <NextRoot {...{ store, history }} />
      </AppContainer>,
      container
    )
  })
}

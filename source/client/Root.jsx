/* eslint-disable max-len */
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Redirect, IndexRedirect, Route } from 'react-router'

// import io from 'api'

import App from 'App'
import Exchanger from 'Exchanger'

const Root = ({
  store,
  history,
}) => {
  const run = (action, pr) => ({ params }) => store.dispatch(action(params[pr]))
  store.dispatch(App.actions.init())
  store.dispatch(Exchanger.actions.init())
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App.container}>
          <Route path="/Exchanger" component={Exchanger.container} />
          <Route path="/Exchanger/:currency" component={Exchanger.container} />
        </Route>
      </Router>
    </Provider>
  )
}

export default Root

import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'

import thunk from 'redux-thunk'
import rootReducer from 'reducer'
import { writeStorage } from 'storage'

const configureStore = (history, initialState) => {
  let middlewareList = [
    thunk,
    routerMiddleware(history),
    // writeStorage({
    //   predicate: (_, action) =>
    //     action.type !== 'AUTH_FORM_CHANGE',
    //   filter: ['routing'],
    // }),
  ]

  const middlewares = applyMiddleware(...middlewareList)
  const devTool = window.devToolsExtension
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      middlewares,
      devTool ? devTool() : f => f,
    )
  )

  if (module.hot) {
    module.hot.accept('reducer', () => {
      const nextRootReducer = require('reducer').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore

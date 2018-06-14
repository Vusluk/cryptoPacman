import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import App from './App'
import Exchanger from './Exchanger'

export default combineReducers({
  routing,
  app: App.reducer,
  exchanger: Exchanger.reducer,
})

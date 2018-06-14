import { browserHistory } from 'react-router'
import { readStorage } from 'storage'
import configureStore from 'configureStore'

const store = configureStore(browserHistory, readStorage())

export default store

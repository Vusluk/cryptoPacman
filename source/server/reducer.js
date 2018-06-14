const redux = require('redux')

const exchanger = require('./Exchanger/reducer')
const profiter = require('./Profiter/reducer')
const trader = require('./Trader/reducer')

const init = {
  io: {},
}

const app = (state = init, action) => {
  switch (action.type) {
    
  default:
    return state
  }
}

      
module.exports = redux.combineReducers({
  app,
  exchanger,
  profiter,
  trader,
})

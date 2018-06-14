const redux       = require('redux');
const thunk       = require('redux-thunk').default;
const reducer     = require('./reducer');

const exchanges   = require('./Exchanger/io').middleware;

const middlewares = [
  thunk,
  exchanges,
]

module.exports = (io) => {
  
  const initialState = {
    app: {
      io,
    },
    profiter: {
      config: {},
    },
    trader: {
      config: {},
    },
  };
  const store = redux.createStore(reducer, initialState, redux.applyMiddleware(...middlewares))

  return store
}

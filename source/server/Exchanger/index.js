const actions = require('./actions')

module.exports = (store, io) => {
  const { getState, dispatch } = store
  io.on('connect', (socket) => {
    io.emit('EXCHANGER_STARTED', { exchanges: getState().exchanger.exchanges, currencies: getState().exchanger.currencies })
    socket.on('EXCHANGER_UPDATE_ORDERBOOKS', ({curName}) => {
      dispatch(actions.updateOrderBooks(curName))
    })
  })
  dispatch(actions.start())
}

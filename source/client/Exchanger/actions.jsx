import { isDef } from 'lib'

import io from 'api'

export const init = () => (dispatch, getState) => {
  io.on('EXCHANGER_STARTED', data => dispatch({
    type: 'EXCHANGER_STARTED',
    ...data,
  }))
  io.on('EXCHANGER_CURRENCIES_UPDATED', (msg) => {
    dispatch({
      type: 'EXCHANGER_CURRENCIES_UPDATED',
      currencies: msg,
    })
  })
  io.on('EXCHANGER_EXCHANGES_UPDATED', (msg) => {
    dispatch({
      type: 'EXCHANGER_EXCHANGES_UPDATED',
      exchanges: msg,
    })
  })
  io.on('EXCHANGER_CURRENCY_UPDATED', (msg) => {
    dispatch({
    type: 'EXCHANGER_CURRENCY_UPDATED',
    currency: msg,
    })
  })
}

export const updateOrderBooks = (curName) => (dispatch, getState) => {
  io.emit('EXCHANGER_UPDATE_ORDERBOOKS', { curName })
}

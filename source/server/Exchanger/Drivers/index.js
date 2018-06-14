const config = require('./config')
const exchanges = config.EXCHANGES_WHITE_LIST.reduce((acc, el) => ({ ...acc, [el]: require(`./${el}`) }), {})

const enable = (exchange) => (dispatch, getState) => {
  return dispatch(exchanges[exchange].updateCurrencies()).then(() => {
    // const currenciesUpdater = setInterval(() => dispatch(exchanges[exchange].updateCurrencies()), config.UPDATE_CURRENCIES_INTERVAL)
    // const pricesUpdater = setInterval(() => dispatch(exchanges[exchange].updatePrices()), config.UPDATE_PRICES_INTERVAL)
    return dispatch({
      type: 'EXCHANGE_ENABLED',
      exchange,
    })
  })
}

const disable = (exchange) => (dispatch, getState) => {
  return dispatch({
    type: 'EXCHANGE_DISABLED',
    exchange,
  })
}

const buy = (exchange, currency, amount) => (dispatch, getState) => {
  
}

const sell = (exchange, currency, amount) => (dispatch, getState) => {
  
}

const transfer = (address) => (dispatch, getState) => {
  
}

module.exports = {
  enable,
  disable,
  buy,
  sell,
  transfer,
}



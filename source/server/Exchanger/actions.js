const config = require('./Drivers/config')
const drivers = config.EXCHANGES_WHITE_LIST.reduce((acc, el) => ({ ...acc, [el]: require(`./Drivers/${el}`) }), {})
const configs = config.EXCHANGES_WHITE_LIST.reduce((acc, el) => ({ ...acc, [el]: require(`./Drivers/${el}/config`) }), {})

const start = () => (dispatch, getState) => {
  const io = getState().app.io
  const exchanger = getState().exchanger
  
  Promise.all(Object.keys(exchanger.exchanges).map(e => dispatch(enable(e))))
    .then(data => {
      console.log('EXCHANGER_STARTED ==>> ', data)
      dispatch({
        type: 'EXCHANGER_START',
        currenciesUpdater: setInterval(() => dispatch(updateExchangesCurrencies()), config.UPDATE_CURRENCIES_INTERVAL),
        pricesUpdater: setInterval(() => dispatch(updateExchangesPrices()), config.UPDATE_PRICES_INTERVAL),
      })
      dispatch({
        type: 'EXCHANGER_STARTED',
        io: (store) => ({ exchanges: store.exchanges, currencies: store.currencies })
      })
    })
  
}

const stop = () => (dispatch, getState) => {
  clearInterval(getState().currenciesUpdater)
  clearInterval(getState().pricesUpdater)
  dispatch({ type: 'EXCHANGER_STOP' })
}

const updateExchangesCurrencies = () => (dispatch, getState) => {
  const exchanges = getState().exchanger.exchanges
  const enabledExchanges = Object.entries(exchanges)
        .filter(([name, info]) => info.enabled)
        .map(([name, info]) => dispatch(drivers[name].updateCurrencies()))
  Promise.all(enabledExchanges).then(data => dispatch({ type: 'EXCHANGER_CURRECIES_UPDATED' }))
}

const updateExchangesPrices = () => (dispatch, getState) => {
  const exchanges = getState().exchanger.exchanges
  const enabledExchanges = Object.entries(exchanges)
        .filter(([name, info]) => info.enabled)
        .map(([name, info]) => dispatch(drivers[name].updatePrices()))
  Promise.all(enabledExchanges)
    .then(data => dispatch({
      type: 'EXCHANGER_CURRENCIES_UPDATED',
      io: (store) => store.currencies
    }))
    .then(() => console.log('CURRENCIES_UPDATED'))
}

const updateOrderBooks = (curName) => (dispatch, getState) => {
  if (!!getState().exchanger.currencies[curName]) {
    const exchanges = Object.entries(getState().exchanger.currencies[curName].exchanges)
          .filter(([exName, exInfo]) => !!exInfo.pairs.BTC)
          .map(([exName, exInfo]) => dispatch(drivers[exName].updateOrderBook(curName)))
    Promise.all(exchanges)
      .then(data => dispatch({ type: 'EXCHANGER_CURRENCY_ORDERBOOKS_MERGE', currency: curName }))
      .then(data => dispatch({
        type: 'EXCHANGER_CURRENCY_UPDATED',
        io: (store) => ({ [curName]: store.currencies[curName] })
      }))
      .then(() => console.log(`CURRENCY_${curName}_ORDERBOOKS_UPDATED`))
  } else {
  console.log('ERROR_NO_CURRENCY')
  }
}

const enable = (exchange) => (dispatch, getState) => dispatch(drivers[exchange].updateCurrencies())
      .then(() => {
        console.log(`${exchange} EXCHANGE ENABLED`)
        return dispatch({
          type: 'EXCHANGER_EXCHANGE_ENABLED',
          exchange,
          config: configs[exchange],
        })
      })


const disable = (exchange) => (dispatch, getState) => dispatch({
  type: 'EXCHANGER_EXCHANGE_DISABLED',
  exchange,
})


const buy = (exchange, currency, amount) => (dispatch, getState) => {
  
}

const sell = (exchange, currency, amount) => (dispatch, getState) => {
  
}

const transfer = (address) => (dispatch, getState) => {
  
}

module.exports = {
  start,
  stop,


  updateOrderBooks,
  enable,
  disable,
  buy,
  sell,
  transfer,
}



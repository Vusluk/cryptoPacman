const moment = require('moment')
const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'yobit'

const setup = {
  exchangeProtocol: 'https',
  hostname: `yobit.net`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

const partitionArray = (array, size) => array
      .map( (e,i) => (i % size === 0) ? array.slice(i, i + size) : null )
      .filter( (e) => e )

const parseMarketName = (name) => {
  const parsedName = name.split('_')
  return { currency: parsedName[0].toUpperCase(), pair: parsedName[1].toUpperCase() }
}

//Hitbtc API calls ==>>
const getCurrencies = () => api.call(setup, 'GET', '/api/3/info')
      .then(data => data.pairs)

// const getPrices = (pairs) => api.call(setup, 'GET', `/api/3/ticker/${pairs}`)
const getPrices = (pairs) => {
  return Promise.all(partitionArray(pairs, 45).map(p => api.call(setup, 'GET', `/api/3/ticker/${p.join('-')}`)))
    .then(data => data.reduce((acc, d) => ({ ...acc, ...d }), {}))
}

const getOrderBook = (pair) => api.call(setup, 'GET', `/api/3/depth/${pair}`, { limit: 2000 })

// const getOrderBooks = () => api.call(setup, 'GET', '/public', { command: 'returnOrderBook', currencyPair: 'all' })

const getExchangeCurrencies = () => {
  return getCurrencies()
    .then(data => {
      return Object.entries(data)
        .filter(([curName, curInfo]) => curInfo.hidden === 0)
        .reduce((acc, [curName, curInfo]) => {
          const parsedName = parseMarketName(curName)
          const existingCurrency = acc.findIndex(c => c.currency === parsedName.currency)
          if(existingCurrency !== -1) {
            acc[existingCurrency].pairs[parsedName.pair] = {
              marketName: curName,
              minTrade: curInfo.min_amount,
              bid: null,
              ask: null,
              bids: null,
              asks: null,
            }
            return acc
          } else {
            return [...acc, {
              currency: parsedName.currency,
              minConfirm: null,
              txFee: null,
              baseAddress: null,
              pairs: {
                [parsedName.pair]: {
                  marketName: curName,
                  minTrade: curInfo.min_amount,
                  bid: null,
                  ask: null,
                  bids: null,
                  asks: null,
                }
              }
            }]
          }
        }, [])
    })
}

//API DECORATOR

const updateCurrencies = () => (dispatch, getState) => {
  return getExchangeCurrencies()
    .then(data => data.forEach(cur => {
      return dispatch({
        type: 'EXCHANGER_EXCHANGE_CURRENCY_UPDATE',
        exchange: name,
        ...cur,
      })
    }))
    .then(data => dispatch(updatePrices()))
    .catch(err => console.log('ERROR', err))
}

const updatePrices = () => (dispatch, getState) => {
  const currencies = getState().exchanger.currencies
  const pairList = lib.pairListCreate(currencies, name)
  return getPrices(pairList.map(p => p.marketName))
    .then(data => pairList.forEach((pair, index) => {
      dispatch({
        type: 'EXCHANGER_EXCHANGE_PRICE_UPDATE',
        exchange: name,
        currency: pair.currency,
        pair: pair.pair,
        bid: +data[pair.marketName].buy,
        ask: +data[pair.marketName].sell,
        timeStampPrice: moment(),
      })
    }))
}

const updateOrderBook = (currency, base = 'BTC') => (dispatch, getState) => {
  const currencies = getState().exchanger.currencies
  const pair = currencies[currency].exchanges[name].pairs[base].marketName
  return getOrderBook(pair)
    .then(data => dispatch({
      type: 'EXCHANGER_EXCHANGE_ORDERBOOK_UPDATE',
      exchange: name,
      currency,
      pair: base,
      asks: data[pair].asks.map(a => ({ amount: +a[1], price: +a[0] })),
      bids: data[pair].bids.map(b => ({ amount: +b[1], price: +b[0] })),
      timeStampBook: moment(),
    }))
}

module.exports = {
  name,
  updateCurrencies,
  updatePrices,
  updateOrderBook,
}


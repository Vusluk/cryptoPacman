const moment = require('moment')
const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'hitbtc'

const setup = {
  exchangeProtocol: 'https',
  hostname: `api.hitbtc.com`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

//Hitbtc API calls ==>>
const getExchangeCurrencies = () => {
  return api.call(setup, 'GET', '/api/1/public/symbols')
    .then(pairList => {
      const allowedPairList = pairList.symbols.filter(pair => config.BASE_CURRENCIES_WHITE_LIST.includes(pair.currency))
      return allowedPairList.reduce((acc, pair) => {
        if (acc.some(cur => cur.commodity === pair.commodity)) return acc
        return [
          ...acc,
          { currency: pair.commodity,
            minConfirm: null,
            txFee: null,
            baseAddress: null,
            pairs: allowedPairList
              .filter(p => p.commodity === pair.commodity)
              .reduce((pairsAcc, p) => ({
                ...pairsAcc,
                [p.currency]: {
                  marketName: p.symbol,
                  minTrade: p.lot,
                  bid: null,
                  ask: null,
                  last: null,
                },
              }), {}),
          },
        ]
      }, [])
    })
}

const getPrice = (pair) => api.call(setup, 'GET', `/api/1/public/${pair.marketName}/ticker`)

const getPrices = () => api.call(setup, 'GET', '/api/1/public/ticker')

const getOrderBook = (pair) => api.call(setup, 'GET', `/api/2/public/orderbook/${pair}`, { limit: 0 })

const getOrderBooks = (pairList) => {
  return Promise.all(pairList.map(pair => getOrderBook(pair.marketName)))
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
  return getPrices()
    .then(data => pairList.forEach((pair, index) => dispatch({
      type: 'EXCHANGER_EXCHANGE_PRICE_UPDATE',
      exchange: name,
      currency: pair.currency,
      pair: pair.pair,
      bid: +data[pair.marketName].bid,
      ask: +data[pair.marketName].ask,
      timeStampPrice: moment(),
    })))
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
      asks: data.ask.map(a => ({ amount: +a.size, price: +a.price })),
      bids: data.bid.map(b => ({ amount: +b.size, price: +b.price })),
      timeStampBook: moment(),
    }))
}

module.exports = {
  name,
  updateCurrencies,
  updatePrices,
  updateOrderBook,
}


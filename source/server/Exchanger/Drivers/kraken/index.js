const moment = require('moment')
const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'kraken'

const setup = {
  exchangeProtocol: 'https',
  hostname: `api.kraken.com`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

const curNameParser = (name) => name.length === 4 && ['X', 'Z'].includes(name[0]) ? name.slice(1) : name

//API calls ==>>
const getCurrencies = () => api.call(setup, 'GET', '/0/public/Assets')
    .then(data => {
      if (data.error.length > 0) throw data.error
      return data.result
    })
const getMarkets = () => api.call(setup, 'GET', '/0/public/AssetPairs')
    .then(data => {
      if (data.error.length > 0) throw data.error
      return data.result
    })
const getPrices = (pairList) => api.call(setup, 'GET', '/0/public/Ticker', { pair: pairList.join(',') })
    .then(data => {
      if (data.error.length > 0) throw data.error
      return data.result
    })

const getOrderBook = (pair) => api.call(setup, 'GET', '/0/public/Depth', { pair: pair, })
    .then(data => {
      if (data.error.length > 0) throw data.error
      return data.result
    })
const getOrderBooks = (pairList) => {
  return Promise.all(pairList.map(pair => getOrderBook(pair.marketName)))
}

const getExchangeCurrencies = () => {
  return Promise.all([
    getCurrencies(),
    getMarkets(),
  ]).then(data => {
    const markets = Object.entries(data[1])
          .map(([marketName, marketInfo]) => {
            return {
              currency: curNameParser(marketInfo.base),
              baseCurrency: curNameParser(marketInfo.quote) === 'XBT' ? 'BTC' : curNameParser(marketInfo.quote),
              marketName: marketName,
            }
          })
          .filter(pair => config.BASE_CURRENCIES_WHITE_LIST.includes(pair.baseCurrency))
          .filter(pair => !pair.marketName.includes('.d'))
    const currencies = Object.entries(data[0])
          .filter(([curName, curInfo]) => curName.slice(0, 1) !== 'Z')
          .map(([curName, curInfo]) => ({
            currency: curNameParser(curName) === 'XBT' ? 'BTC' : curNameParser(curName),
            minConfirm: null,
            txFee: null,
            baseAddress: null,
            pairs: markets
              .filter(market => market.currency === (curNameParser(curName) === 'XBT' ? 'BTC' : curNameParser(curName)))
              .reduce((pairsAcc, p) => ({
                ...pairsAcc,
                [p.baseCurrency]: {
                  marketName: p.marketName,
                  minTrade: null,
                  bid: null,
                  ask: null,
                  bids: null,
                  asks: null,
                },
              }), {}),
          }))
    return currencies
  })
}

//API DECORATOR

const updateCurrencies = () => (dispatch, getState) => {
  return getExchangeCurrencies()
    .then(data => data.forEach(cur => dispatch({
      type: 'EXCHANGER_EXCHANGE_CURRENCY_UPDATE',
      exchange: name,
      ...cur,
    })))
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
      ask: data[pair.marketName].a[0],
      bid: data[pair.marketName].b[0],
      timeStampPrice: moment(),
    })}))
}

const updateOrderBook = (currency, base = 'BTC') => (dispatch, getState) => {
  const currencies = getState().exchanger.currencies
  const pair = currencies[currency].exchanges[name].pairs[base].marketName
  return getOrderBook(pair)
    .then(data => {
      const result = Object.values(data)
      dispatch({
        type: 'EXCHANGER_EXCHANGE_ORDERBOOK_UPDATE',
        exchange: name,
        currency,
        pair: base,
        asks: result[0].asks.map(a => ({ amount: +a[1], price: +a[0] })),
        bids: result[0].bids.map(b => ({ amount: +b[1], price: +b[0] })),
        timeStampBook: moment(),
      })
    })
}

module.exports = {
  name,
  updateCurrencies,
  updatePrices,
  updateOrderBook,
}


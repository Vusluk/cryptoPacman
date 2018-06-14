const moment = require('moment')
const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'livecoin'

const setup = {
  exchangeProtocol: 'https',
  hostname: `api.livecoin.net`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

//API calls ==>>
const getCurrencies = () => api.call(setup, 'GET', '/info/coinInfo')
    .then(data => {
      if (!data.success) throw data
      return data.info
    })
const getMarkets = () => api.call(setup, 'GET', '/exchange/restrictions')
    .then(data => {
      if (!data.success) throw data
      return data.restrictions
    })
const getPrices = (pairList) => api.call(setup, 'GET', '/exchange/ticker')

const getOrderBook = (pair) => api.call(setup, 'GET', '/exchange/order_book', { currencyPair: pair, groupByPrice: 'true', maxValue: 'true' })

const getOrderBooks = (pairList) => {
  return Promise.all(pairList.map(pair => getOrderBook(pair.marketName)))
}

const getExchangeCurrencies = () => {
  return Promise.all([
    getCurrencies(),
    getMarkets(),
  ]).then(data => {
    const markets = data[1]
          .map(pair => {
            const parsedMarketName = pair.currencyPair.split('/')
            return {
              currency: parsedMarketName[0] === 'BCC' ? 'BCH' : parsedMarketName[0],
              baseCurrency: parsedMarketName[1],
              marketName: pair.currencyPair,
              bid: null,
              ask: null,
              bids: null,
              asks: null,
            }
          })
          .filter(pair => config.BASE_CURRENCIES_WHITE_LIST.includes(pair.baseCurrency))
    const currencies = data[0]
          .filter(cur => cur.walletStatus !== 'down') //WTF???
          .map(cur => ({
            currency: cur.symbol === 'BCC' ? 'BCH' : cur.symbol,
            minConfirm: null,
            txFee: cur.withdrawFee,
            baseAddress: null,
            pairs: markets
              .filter(market => market.currency === (cur.symbol === 'BCC' ? 'BCH' : cur.symbol))
              .reduce((pairsAcc, p) => ({
                ...pairsAcc,
                [p.baseCurrency]: {
                  marketName: p.marketName,
                  minTrade: cur.minOrderAmount,
                  bid: p.bid,
                  ask: p.ask,
                  bids: p.bids,
                  asks: p.asks,
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
  return getPrices()
    .then(data => pairList.forEach((pair, index) => {
      const pairPrice = data.find(p => p.symbol === pair.marketName) || {}
      dispatch({
        type: 'EXCHANGER_EXCHANGE_PRICE_UPDATE',
        exchange: name,
        currency: pair.currency,
        pair: pair.pair,
        ask: pairPrice.best_ask,
        bid: pairPrice.best_bid,
        timeStampPrice: moment(),
    })}))
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
      asks: data.asks.map(a => ({ amount: +a[1], price: +a[0] })),
      bids: data.bids.map(b => ({ amount: +b[1], price: +b[0] })),
      timeStampBook: moment(),
    }))
}

module.exports = {
  name,
  updateCurrencies,
  updatePrices,
  updateOrderBook,
}

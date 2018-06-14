const moment = require('moment')
const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'poloniex'

const setup = {
  exchangeProtocol: 'https',
  hostname: `poloniex.com`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

//Hitbtc API calls ==>>
const getCurrencies = () => api.call(setup, 'GET', '/public', { command: 'returnCurrencies'})

const getPrices = () => api.call(setup, 'GET', '/public', { command: 'returnTicker' })

const getOrderBook = (pair) => api.call(setup, 'GET', '/public', { command: 'returnOrderBook', currencyPair: pair, depth: 10000 })

const getOrderBooks = () => api.call(setup, 'GET', '/public', { command: 'returnOrderBook', currencyPair: 'all' })

const getExchangeCurrencies = () => {
  return Promise.all([
    getCurrencies(),
    getPrices(),
  ]).then(data => {
    const markets = Object.entries(data[1])
          .map(([marketName, marketInfo]) => {
            const parsedMarketName = marketName.split('_')
            return {
              currency: parsedMarketName[1],
              baseCurrency: parsedMarketName[0],
              marketName: marketName,
              bid: marketInfo.highestBid,
              ask: marketInfo.lowestAsk,
              last: marketInfo.last,
            }
          })
          .filter(pair => config.BASE_CURRENCIES_WHITE_LIST.includes(pair.baseCurrency))
    const currencies = Object.entries(data[0])
          .filter(([curName, curInfo]) => !curInfo.disabled)
          .map(([curName, curInfo]) => ({
            currency: curName,
            minConfirm: curInfo.minConf,
            txFee: curInfo.txFee,
            baseAddress: null,
            pairs: markets
              .filter(market => market.currency === curName)
              .reduce((pairsAcc, p) => ({
                ...pairsAcc,
                [p.baseCurrency]: {
                  marketName: p.marketName,
                  minTrade: null,
                  bid: p.bid,
                  ask: p.ask,
                  last: p.last,
                },
              }), {}),
          }))
    return currencies
  }).catch(err => console.log('ERROR', err))
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
}

const updatePrices = () => (dispatch, getState) => {
  const currencies = getState().exchanger.currencies
  const pairList = lib.pairListCreate(currencies, name)
  return getPrices()
    .then(data => pairList.forEach((pair, index) => {
      dispatch({
      type: 'EXCHANGER_EXCHANGE_PRICE_UPDATE',
      exchange: name,
      currency: pair.currency,
      pair: pair.pair,
      bid: +data[pair.marketName].highestBid,
      ask: +data[pair.marketName].lowestAsk,
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


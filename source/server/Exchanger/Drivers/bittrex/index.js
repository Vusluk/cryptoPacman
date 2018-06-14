const moment = require('moment')
const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'bittrex'

const setup = {
  exchangeProtocol: 'https',
  hostname: `bittrex.com`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

//Bittrex API calls ==>>
const getCurrencies = () => {
  return api.call(setup, 'GET', '/api/v1.1/public/getcurrencies').then(data => {
    if (!data.success) throw data
    const cnd = data.result.find(c => c.Currency === 'LRC' || c.CurrencyLong === 'loopring' || c.CurrencyLong === 'Loopring')
    console.log('CND ==>> ', cnd)
    return data.result.filter(cur => cur.IsActive === true)
  })
}

const getMarkets = () => {
  return api.call(setup, 'GET', '/api/v1.1/public/getmarkets').then(data => {
    if (!data.success) throw data
    return data.result.filter(cur => cur.IsActive === true && config.BASE_CURRENCIES_WHITE_LIST.includes(cur.BaseCurrency))
  })
}

const getPrice = (pair) => api.call(setup, 'GET', '/api/v1.1/public/getticker', { market: pair }).then(data => {
  if (!data.success) throw data
  return data.result
})

const getPrices = (pairList) => {
  return Promise.all(pairList.map(pair => getPrice(pair.marketName)))
}

const getOrderBook = (pair) => api.call(setup, 'GET', '/api/v1.1/public/getorderbook', { market: pair, type: 'both' }).then(data => {
  if (!data.success) throw data
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
    const currenciesArr = data[0]
    const marketsArr = data[1]
    if (data[0].error) return { error: true, data: data[0].data }
    if (data[1].error) return { error: true, data: data[1].data }
    const currencies = currenciesArr.map(cur => ({
      currency: cur.Currency === 'BCC' ? 'BCH' : cur.Currency,
      fullName: cur.CurrencyLong,
      coinType: cur.CoinType,
      minConfirm: cur.MinConfirmation,
      txFee: cur.TxFee,
      baseAddress: cur.BaseAddress,
      pairs: marketsArr
        .filter(pair => pair.MarketCurrency === cur.Currency)
        .reduce((acc, el) => ({
          ...acc,
          [el.BaseCurrency]: {
            marketName: el.MarketName,
            minTrade: el.MinTradeSize,
            bid: null,
            ask: null,
            last: null,
          },
        }), {}),
    }))
    return { error: false, data: currencies }
  })
}

//API DECORATOR

const updateCurrencies = () => (dispatch, getState) => {
  return getExchangeCurrencies()
    .then(data => data.data.forEach(cur => dispatch({
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
  return getPrices(pairList)
    .then(data => pairList.forEach((pair, index) => dispatch({
      type: 'EXCHANGER_EXCHANGE_PRICE_UPDATE',
      exchange: name,
      currency: pair.currency,
      pair: pair.pair,
      ask: +data[index].Ask,
      bid: +data[index].Bid,
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
      asks: data.sell.map(a => ({ amount: +a.Quantity, price: +a.Rate })),
      bids: data.buy.map(b => ({ amount: +b.Quantity, price: +b.Rate })),
      timeStampBook: moment(),
    }))
}

module.exports = {
  name,
  updateCurrencies,
  updatePrices,
  updateOrderBook,
}


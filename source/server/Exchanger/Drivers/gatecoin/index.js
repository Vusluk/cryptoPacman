const api = require('../api')
const config = require('../config')
const lib = require('../lib')
const name = 'gatecoin'

const setup = {
  exchangeProtocol: 'https',
  hostname: `api.gatecoin.com`,
  port: 443,
  apiKey: '',
  apiSecret: '',
  resErrChecker: (data) => true,
  resErrHandler: (data) => ({ error: true, data, }),
}

//API calls ==>>
// const getCurrencies = () => api.call(setup, 'GET', '/0/public/Assets')
//     .then(data => {
//       if (data.error.length > 0) throw data.error
//       return data.result
//     })
// const getMarkets = () => api.call(setup, 'GET', '/0/public/AssetPairs')
//     .then(data => {
//       if (data.error.length > 0) throw data.error
//       return data.result
//     })
const getPrices = (pairList) => api.call(setup, 'GET', '/Public/LiveTickers')
    .then(data => {
      if (data.responseStatus.message !== 'OK') throw data.error
      return data.tickers
    })

const getExchangeCurrencies = () => {
  return getPrices()
    .then(data => {
      return data
        .reduce((acc, ticker) => {
          if (acc.some(cur => cur.currency === ticker.currencyPair.slice(0, 3))) return acc
          return [ ...acc, { currency: ticker.currencyPair.slice(0, 3) }]
        }, [])
        .map(cur => ({
          currency: cur.currency,
          minConfirm: null,
          txFee: null,
          baseAddress: null,
          pairs: data
            .filter(p => p.currencyPair.slice(0, 3) === cur.currency && config.BASE_CURRENCIES_WHITE_LIST.includes(p.currencyPair.slice(-3)))
            .reduce((pairsAcc, p) => ({
              ...pairsAcc,
              [p.currencyPair.slice(-3)]: {
                marketName: p.currencyPair,
                minTrade: null,
                bid: p.bid,
                ask: p.ask,
                last: p.last,
              },
            }), {}),
        }))
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
    .catch(err => console.log('ERROR', err))
}

const updatePrices = () => (dispatch, getState) => {
  const currencies = getState().exchanger.currencies
  const pairList = lib.pairListCreate(currencies, name)
  return getPrices()
    .then(data => pairList.forEach((pair, index) => {
      const pairPrice = data.find(p => p.currencyPair === pair.marketName)
      dispatch({
        type: 'EXCHANGER_EXCHANGE_PRICE_UPDATE',
        exchange: name,
        currency: pair.currency,
        pair: pair.pair,
        ask: pairPrice.ask,
        bid: pairPrice.bid,
        last: pairPrice.last,
    })}))
}

module.exports = {
  name,
  updateCurrencies,
  updatePrices,
}

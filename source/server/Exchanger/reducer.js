const config = require('./Drivers/config')
const moment = require('moment')

const isDef = (val) => val !== undefined && val !== null

const init = {
  enabled: false,
  config: {},
  currencies: {},
  exchanges: config.EXCHANGES_WHITE_LIST.reduce((acc, el) => ({...acc, [el]: { enabled: false }}), {}),
}

module.exports = (state = init, action) => {
  switch (action.type) {
  case 'EXCHANGER_START':
    return {...state,
            enabled: true,
            currenciesUpdater: action.currenciesUpdater,
            pricesUpdater: action.pricesUpdater,
           }
  case 'EXCHANGER_STOP':
    return {...state,
            enabled: false,
            currenciesUpdater: null,
            pricesUpdater: null,
           }
  case 'EXCHANGER_EXCHANGE_ENABLED':
    return {...state,
            exchanges: {
              ...state.exchanges,
              [action.exchange]: {
                ...state.exchanges[action.exchange],
                enabled: true,
                ...action.config,
              },
            },
           }
  case 'EXCHANGER_EXCHANGE_DISABLED':
    return {...state,
            exhcanges: {
              ...state.exchanges,
              [action.exchange]: {
                ...state.exchanges[action.exchange],
                enabled: false,
              },
            },
           }
  case 'EXCHANGER_EXCHANGE_CURRENCY_UPDATE':
    const currency = !!state.currencies[action.currency] ? {...state.currencies[action.currency]} : {}
    const exchanges = !!currency.exchanges ? {...state.currencies[action.currency].exchanges} : {}
    const exchange = !!exchanges[action.exchange] ? {...state.currencies[action.currency].exchanges[action.exchange]} : {}
    const txFeeMax = isDef(currency.txFeeMax) ? (+action.txFee > currency.txFeeMax ? +action.txFee : currency.txFeeMax)
          : isDef(action.txFee) ? action.txFee
          : 0
    const fullName = isDef(currency.fullName) ? currency.fullName : action.fullName
    const coinType = isDef(currency.coinType) ? currency.coinType : action.coinType
    const bidss = isDef(currency.bids) ? currency.bids : []
    const askss = isDef(currency.asks) ? currency.asks : []

    return {...state,
            currencies: {
              ...state.currencies,
              [action.currency]: {
                ...currency,
                txFeeMax,
                fullName,
                coinType,
                bids: bidss,
                asks: askss,
                exchanges: {
                  ...exchanges,
                  [action.exchange]: {
                    ...exchange,
                    minConfirm: action.minConfirm || null,                 //WILL DEPRECATED
                    txFee: action.txFee || null,
                    // rxMinConfirm: action.minConfirm || null,        //NEW
                    // txMinAmount: action.txMinAmount || null,        //NEW
                    // rxMinAmount: action.rxMinAmount || null,        //NEW
                    // orderMinAmount: action.orderMinAmount || null,  //NEW: Must be here or in 'pairs[pair]'???
                    baseAddress: action.baseAddress || null,
                    pairs: action.pairs,
                  },
                },
              },
            },
           }
  case 'EXCHANGER_EXCHANGE_PRICE_UPDATE':
    const pair = state.currencies[action.currency].exchanges[action.exchange].pairs[action.pair]
    const asksss = isDef(pair.asks) ? pair.asks : [] 
    const bidsss = isDef(pair.bids) ? pair.bids : [] 
    return {...state,
            currencies: {
              ...state.currencies,
              [action.currency]: {
                ...state.currencies[action.currency],
                exchanges: {
                  ...state.currencies[action.currency].exchanges,
                  [action.exchange]: {
                    ...state.currencies[action.currency].exchanges[action.exchange],
                    pairs: {
                      ...state.currencies[action.currency].exchanges[action.exchange].pairs,
                      [action.pair]: {
                        ...pair,
                        bid: action.bid,
                        ask: action.ask,
                        bids: bidsss,
                        asks: asksss,
                        timeStampPrice: action.timeStampPrice,
                      },
                    },
                  },
                },
              },
            },
           }
  case 'EXCHANGER_EXCHANGE_ORDERBOOK_UPDATE':
    return {...state,
            currencies: {
              ...state.currencies,
              [action.currency]: {
                ...state.currencies[action.currency],
                exchanges: {
                  ...state.currencies[action.currency].exchanges,
                  [action.exchange]: {
                    ...state.currencies[action.currency].exchanges[action.exchange],
                    pairs: {
                      ...state.currencies[action.currency].exchanges[action.exchange].pairs,
                      [action.pair]: {
                        ...state.currencies[action.currency].exchanges[action.exchange].pairs[action.pair],
                        bids: action.bids,
                        asks: action.asks,
                        timeStampBook: action.timeStampBook,
                      },
                    },
                  },
                },
              },
            },
           }
  case 'EXCHANGER_CURRENCY_ORDERBOOKS_MERGE':
    const valedEx = Object.entries(state.currencies[action.currency].exchanges)
    const asks = valedEx
          .reduce((acc, [exName, ex]) => {
            if (ex.pairs.BTC && ex.pairs.BTC.asks) return [...acc, ...ex.pairs.BTC.asks.map(o => ({ ...o, exchange: exName }))]
            return acc
          }, [])
          .reduce((acc, order) => {
            const founded = acc.findIndex(o => o.price == order.price)
            if (founded >= 0) {
              acc[founded] = { ...acc[founded], amount: acc[founded].amount + order.amount } //////?????
              return acc
            }
            return [ ...acc, order ]
          }, [])
          .filter(order => (order.amount * order.price) > 0.001)
          .sort((a, b) => a.price - b.price)
    const bids = valedEx
          .reduce((acc, [exName, ex]) => {
            if (ex.pairs.BTC && ex.pairs.BTC.bids) return [...acc, ...ex.pairs.BTC.bids.map(o => ({ ...o, exchange: exName }))]
            return acc
          }, [])
          .reduce((acc, order) => {
            const founded = acc.findIndex(o => o.price == order.price)
            if (founded >= 0) {
              acc[founded] = { ...acc[founded], amount: acc[founded].amount + order.amount }
              return acc
            }
            return [ ...acc, order ]
          }, [])
          .filter(order => (order.amount * order.price) > 0.001)
          .sort((a, b) => a.price - b.price)
    return {...state,
            currencies: {
              ...state.currencies,
              [action.currency]: {
                ...state.currencies[action.currency],
                asks,
                bids,
              },
            },
           }
  default:
    return state
  }  
}

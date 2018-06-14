import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actionsApp from '../App/actions'
import * as actions from './actions'
import { calcProfit } from './lib'

import Layout from './Layout'

const calcTotals = (arr) => arr.reduce((acc, o) => {
  return { amount: acc.amount + o.amount, btc: acc.btc + (o.amount * o.price)}
}, { amount: 0, btc: 0 })

const provider = (state, props) => {
  const controls = {
    currency: (((state.app.forms.exchangerControl || {}).fields || {}).currency || {}).value,
    txFee: (((state.app.forms.exchangerControl || {}).fields || {}).txFee || {}).value || '',
    po: (((state.app.forms.exchangerControl || {}).fields || {}).po || {}).value,
    balance: (((state.app.forms.exchangerControl || {}).fields || {}).balance || {}).value || '',
    calcFrom: (((state.app.forms.exchangerControl || {}).fields || {}).calcFrom || {}).value || 1,
    calcTo: (((state.app.forms.exchangerControl || {}).fields || {}).calcTo || {}).value || 1,
  }
  const exStats = state.exchanger.exchanges
  return {
    controls,
    currency: props.params.currency,
    exchanges: state.exchanger.exchanges,
    currencies: Object.entries(state.exchanger.currencies || {})
      .map(([curName, curInfo]) => {
        const exchanges = Object.entries(curInfo.exchanges).filter(([exName, exInfo]) => !!exInfo.pairs.BTC)
        const bid = exchanges.reduce((acc, [exName, exInfo], i) => {
          if (i === 0 || exInfo.pairs.BTC.bid > acc.price) return { price: exInfo.pairs.BTC.bid, exchange: exName }
          return acc
        }, { price: 0 })
        const ask = exchanges.reduce((acc, [exName, exInfo], i) => {
          if (i === 0 || exInfo.pairs.BTC.ask < acc.price) return { price: exInfo.pairs.BTC.ask, exchange: exName }
          return acc
        }, { price: 0 })
        const minVolume = !!curInfo.txFeeMax ? ((curInfo.txFeeMax * 100) / (controls.txFee !== '' ? controls.txFee : 1)) : null
        const minTrading = {
          amount: minVolume ? minVolume.toFixed(6) : null,
          btc: minVolume ? (minVolume * ask.price) : null,
          usd: minVolume ? (minVolume * ask.price * 6870).toFixed(1) : null,
        }
        const askExFee = (exStats[ask.exchange] || {}).takerFee || 0.25
        const bidExFee = (exStats[bid.exchange] || {}).takerFee || 0.25
        const diff = calcProfit(ask.price, bid.price, askExFee, bidExFee, curInfo.txFeeMax, minVolume)
        const total = {
          bids: { ...calcTotals(curInfo.bids), orders: curInfo.bids.length},
          asks: { ...calcTotals(curInfo.asks), orders: curInfo.asks.length},
        }

        return {
          ...curInfo,
          name: curName,
          bid,
          ask,
          diff,
          minTrading,
          total,
        }
      })
      // .sort((a, b) => {
      //   if (a.name < b.name) return -1
      //   if (a.name > b.name) return 1
      //   return 0
      // })
      .filter(cur => (((state.app.forms.exchangerControl || {}).fields || {}).po || {}).value ? cur.diff > 0 : true)
      .filter(cur => controls.balance !== '' ? +cur.minTrading.btc < +controls.balance : true)
      .sort((a, b) => +b.diff - +a.diff),
  }
}

const dispatchProvider = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  actionsApp: bindActionCreators(actionsApp, dispatch),
})

export default connect(provider, dispatchProvider)(Layout)

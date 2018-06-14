import React from 'react'
import style from './index.css'
import { Link } from 'react-router'

const CurrencyCard = ({
  name,
  fullName,
  bid,
  ask,
  diff,
  minTrading,
  coinType,
  txFeeMax,
  total,

  className,
  actions,
  actionsApp,
}) => (
  <div className={className ? `${style.root} ${className}` : style.root}>
    <Link to={`/exchanger/${name}`}><div className={style.name}><span>{name}</span><span>{fullName}</span></div></Link>
    <div className={style.stats}>
      <div><span>ТИП</span><span>{coinType}</span></div>
      <div><span>КОММИСИЯ</span><span>{txFeeMax}</span></div>
      <div><span>ОРДЕРОВ</span><span>{total.bids.orders}/{total.asks.orders}</span></div>
      <div><span>МОНЕТ</span><span>{total.bids.amount.toFixed(0)}/{total.asks.amount.toFixed(0)}</span></div>
      <div><span>ОБЪЕМ BTC</span><span>{total.bids.btc.toFixed(2)}/{total.asks.btc.toFixed(2)}</span></div>
    </div>
    <div className={style.trade}>
      <div>
        <span>{bid.exchange}</span>
        <span>{diff}</span>
        <span>{ask.exchange}</span>
      </div>
      <div>
        <span>{bid.price}</span>
        <span>{minTrading.usd ? minTrading.usd : null}</span>
        <span>{ask.price}</span>
      </div>
    </div>
    <div className={style.control}>
      <div onClick={() => actions.updateOrderBooks(name)}><span>ОБНОВИТЬ</span></div>
      <div><span>РЕЗЕРВ</span></div>
    </div>
  </div>
)

export default CurrencyCard

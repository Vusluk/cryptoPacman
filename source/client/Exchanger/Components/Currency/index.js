import React from 'react'
import style from './index.css'
import { Link } from 'react-router'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from 'recharts'
import { subPercent, addPercent } from '../../lib'

import Input from 'components/Input'
import Profiter from '../Profiter'
import CurrencyCard from '../CurrencyCard'
import OrdersChart from '../OrdersChart'

const mergeOrders = (bids, asks) => bids.map(o => ({ ...o, bid: o.amount })).concat(asks.map(o => ({ ...o, ask: o.amount })))

const Currency = ({
  name,
  fullName,
  txFeeMax,
  coinType,
  exchanges,
  asks = [],
  bids = [],
  bid = { price: 0, exchange: 'N/A' },
  ask = { price: 0, exchange: 'N/A' },
  diff = null,
  minTrading = {},
  total,

  actions,
  actionsApp,
  className,
}) => {
  const orders = mergeOrders(bids, asks)
  const ordersLocal = mergeOrders(bids.filter(o => o.price > (bid.price * 0.8)), asks.filter(o => o.price < (ask.price * 1.2)))

  return (
    <div className={className ? `${style.root} ${className}` : style.root}>
      <div className={style.header}>
        <CurrencyCard {...{
          name,
          fullName,
          bid,
          ask,
          diff,
          minTrading,
          coinType,
          txFeeMax,
          total,

          actions,
          actionsApp,
          className: style.currencyCard,
        }} />
        <Profiter {...{
          exchanges,
          txFeeMax,
          ask,
          bid,
          minTrading,

          actions,
          actionsApp,
          className: style.profiter,
        }} />
      </div>
      { ordersLocal.length ? <OrdersChart orders={ordersLocal} prices={{ ask: asks[0].price }} /> : null}
      { orders.length ? <OrdersChart orders={orders} prices={{ ask: asks[0].price }} /> : null}
    </div>
  )
}

export default Currency

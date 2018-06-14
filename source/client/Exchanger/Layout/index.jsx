import React from 'react'
import style from './index.css'
import { Link } from 'react-router'

import ControlPanel from '../Components/ControlPanel'
import Currencies from '../Components/Currencies'
import Currency from '../Components/Currency'

const colorizer = (percent) => percent < 0 ? 'red' : percent < 5 ? 'yellow' : 'green'
const TX_FEE_BASE = 1

const subPercent = (amount, percent) => amount - ((amount * percent) / 100)
const addPercent = (amount, percent) => amount + ((amount * percent) / 100)
const diffPercent = (from, to) => ((to * 100) / from) - 100

const calcProfit = (fromPrice, toPrice, buyFee, sellFee, transferFee, dealAmount) => {
  const buy = subPercent((dealAmount * fromPrice), buyFee) / fromPrice
  const transfer = buy - transferFee
  const sell = subPercent((transfer * toPrice), sellFee)
  return diffPercent((dealAmount * fromPrice), sell).toFixed(2)
}

const Exchanger = ({
  controls,
  currency,
  exchanges,
  currencies,
  
  actions,
  actionsApp,
}) => {
  if (currency) return (<Currency {...currencies.find(c => c.name === currency)} actions={actions} />)
  return (<Currencies {...{ currencies, controls, actions, actionsApp }} />)
}

export default Exchanger

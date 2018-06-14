import React from 'react'
import style from './index.css'
import { Link } from 'react-router'
import { diffPercent } from '../../lib'
import Input from 'components/Input'

const colorizer = (percent) => percent < 1 ? 'red' : percent < 5 ? 'yellow' : 'green'
const TX_FEE_BASE = 1

const ControlPanel = ({
  controls,
  actions,
  actionsApp,
}) => {
  const result = diffPercent(controls.calcTo, controls.calcFrom).toFixed(2)
  return (
    <div className={style.root}>
      <Input {...{
               label: 'Валюта',
               value: controls.currency,
               onChange: (value) => actionsApp.formChange('exchangerControl', 'currency', value),
      }} />
      <Input {...{
               type: 'checkbox',
               label: 'PO',
               value: controls.po,
               onChange: (value) => actionsApp.formChange('exchangerControl', 'po', value),
      }} />
      <Input {...{
               label: 'Balance',
               value: controls.balance,
               onChange: (value) => actionsApp.formChange('exchangerControl', 'balance', value),
      }} />
      <Input {...{
               label: 'txFee',
               value: controls.txFee,
               onChange: (value) => actionsApp.formChange('exchangerControl', 'txFee', value),
      }} />
      <div className={style.calc}>
        <Input {...{
                 label: 'FROM',
                 value: controls.calcFrom,
                 onChange: (value) => actionsApp.formChange('exchangerControl', 'calcFrom', value),
        }} />
        <Input {...{
                 label: 'TO',
                 value: controls.calcTo,
                 onChange: (value) => actionsApp.formChange('exchangerControl', 'calcTo', value),
        }} />
        <div>{result}</div>  
      </div>  
    </div>
  )
}

export default ControlPanel
      // <Input {...{
      //          type: 'range',
      //          label: 'От/До',
      //          value: controls.priceRange,
      //          options: { separator: '/' },
      //          onChange: (value) => actions.fromOnChange('priceRange', value),
      // }} />
      // <Input {...{
      //          type: 'checkbox',
      //          label: 'ХЗ',
      //          value: controls.priceRange,
      //          options: { separator: '/' },
      //          onChange: (value) => actions.fromOnChange('priceRange', value),
      // }} />

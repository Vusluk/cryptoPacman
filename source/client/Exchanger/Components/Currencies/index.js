import React from 'react'
import style from './index.css'

import ControlPanel from '../ControlPanel'
import CurrencyCard from '../CurrencyCard'

const Currencies = ({
  controls,
  currencies,
  
  actions,
  actionsApp,
}) => {
  const reg = new RegExp(controls.currency ? controls.currency : '', 'i')
  return (
    <div className={style.root}>
      <ControlPanel {...{ controls, actions, actionsApp }} />
      <div className={style.cards}>
        {currencies
          .filter(cur => cur.name.search(reg) !== -1 || (cur.fullName ? cur.fullName.search(reg) !== -1 : false))
          .map((cur, i) => (<CurrencyCard {...cur} actions={actions} className={style.card} key={i} />))
        }
      </div>
    </div>
  )
}

export default Currencies

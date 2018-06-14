import React from 'react'
import style from './index.css'
import { Link } from 'react-router'

const Landing = ({
  app,
  actions,
  children,
}) => {
  return (
    <div className={style.root}>
      <Link to='/Exchanger'>EXCHANGER</Link>
    </div>
  )
}

export default Landing

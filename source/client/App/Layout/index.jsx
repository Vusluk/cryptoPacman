import React from 'react'
import style from './index.css'

import Header from '../Components/Header'
// import SidePanel from '../Components/SidePanel'
// import Footer from '../Components/Footer'
import Landing from '../Components/Landing'

const App = ({
  app,
  actions,
  children,
}) => {
  return (
    <div className={style.root}>
      <Header {...{
        app,
        actions,
      }} />
      <div className={style.body}>
        {children ? children : <Landing/>}
      </div>
    </div>
  )
}

export default App

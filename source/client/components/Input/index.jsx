import React from 'react'
import style from './index.css'
import Icon from 'components/Icon'

import Text from './Text'
import Range from './Range'
import Button from './Button'
import Checkbox from './Checkbox'

const defx = () => {}

const Input = ({
  options,
  type = 'text',
  ...props,
}) => {
  switch (type) {
  case 'text': return (<Text {...{ ...props, ...options }} />)
  case 'range': return (<Range {...{ ...props, ...options }} />)
  case 'button': return (<Button {...{ ...props, ...options }} />)
  case 'checkbox': return (<Checkbox {...{ ...props, ...options }} />)
  default: return (<div />)
  }
}

export default Input

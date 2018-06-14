import React from 'react'
import style from './index.css'
import Icon from 'components/Icon'

const defx = () => {}

const Button = ({
  type = 'button',
  disabled = false,
  focus = false,
  label = '',
  onClick = defx,
  onAccept = defx,
  className = '',
}) => {
  return (
    <label className={`${style.root}${className !== '' ? ` ${className}` : ''}`}>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        autoFocus={focus}
      >
        {label.toUpperCase()}
      </button>
    </label>
  )
}

export default Button

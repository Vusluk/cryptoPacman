import React from 'react'
import style from './index.css'

const defx = () => {}

const Button = ({
  type = 'button',
  disabled = false,
  focus = false,
  value = '',
  onClick = defx,
  className = '',
}) => {
  return (
    <label className={`${style.root}${className !== '' ? ` ${className}` : ''}`}>
      <button
        type={type}
        disabled={disabled}
        onClick={e => onClick(e.target)}
        autoFocus={focus}
      >
        {value.toUpperCase()}
      </button>
    </label>
  )
}

export default Button

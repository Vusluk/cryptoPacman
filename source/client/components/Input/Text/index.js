import React from 'react'
import style from './index.css'
import Icon from 'components/Icon'

const defx = () => {}

const Text = ({
  type = 'text',
  disabled = false,
  focus = false,
  label = '',
  value = '',
  onChange = defx,
  onAccept = defx,
  className = '',
}) => {
  return (
    <label className={`${style.root}${className !== '' ? ` ${className}` : ''}`}>
      <span className={value && value !== '' ? style.labelUp : style.labelNormal}>{label.toUpperCase()}</span>
      <input
        type={type}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        title={value}
        value={value}
        autoFocus={focus}
      />
      {value && value !== '' &&
        <Icon {...{
          type: 'clear',
          size: 18,
          onClick: () => onChange(''),
        }} />
      }
    </label>
  )
}

export default Text

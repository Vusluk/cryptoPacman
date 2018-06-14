import React from 'react'
import style from './index.css'
import Icon from 'components/Icon'

const defx = () => {}

const Checkbox = ({
  type = 'checkbox',
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
      <span className={style.labelNormal}>{label.toUpperCase()}</span>
      <div>
        <input
          type={type}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
          value={value}
          autoFocus={focus}
        />
      </div>
    </label>
  )
}

export default Checkbox

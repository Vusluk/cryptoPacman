import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import style from './index.css'

import Icon from 'components/Icon'

const isDef = val => val !== undefined && val !== null

class Select extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: props.open || false,
    }
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
    this.select = this.select.bind(this)
    this.open = this.open.bind(this)
    this.clear = this.clear.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('touchend', this.handleDocumentClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('touchend', this.handleDocumentClick, false)
  }

  handleDocumentClick(event) {
    if (!findDOMNode(this).contains(event.target)) {
      this.setState({ open: false })
    }
  }

  select(value) {
    return () => {
      this.setState({
        open: false,
      })
      this.props.onChange(value)
    }
  }

  clear() {
    return () => {
      this.setState({
        open: false,
      })
      this.props.onChange('')
    }
  }

  open() {
    return () => {
      this.setState({
        open: !this.state.open,
      })
    }
  }

  render() {
    const {
      value = '',
      label = '',
      disabled,
      options = [],
      className = '',
    } = this.props
    const { open } = this.state
    const selected = options.find(el => el.value === value) || {}

    const toggleOpen = disabled ? () => {} : this.open
    return (
      <label
        className={`${style.root}${className !== '' ? ` ${className}` : ''}`}
        style={open ? { zIndex: 9999 } : {}}
        onClick={toggleOpen()}
      >
        {value !== '' &&
          <span className={style.clear} onClick={this.clear()}>
            <Icon type={'clear'} size={24} rotate={open ? 'up' : 'down'} />
          </span>
        }
        <span className={style.arrow}>
          <Icon type={'arrow'} size={24} rotate={open ? 'up' : 'down'} />
        </span>
        <span
          className={style.placeholder}
        >
          {label}
        </span>
        <span
          className={style.input}
          disabled={disabled}
        >
          {isDef(selected.label) ? selected.label : selected.value}
        </span>
        <span className={style.border} />
        {open && (
          <div className={style.optionsContainer}>
            <ul className={style.options}>
              {options.map(option => (
                <li
                  key={option.value}
                  onClick={this.select(option.value)}
                >
                  <span>{isDef(option.label) ? option.label : option.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </label>
    )
  }
}

export default Select

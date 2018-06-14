import React, { PureComponent } from 'react'

import { ICONS_TYPES, ICON_COMPS, ROTATE_TYPES, ROTATE_VALUES } from './constants'

import style from './index.css'


class TIcon extends PureComponent {
  static propTypes = {
    size: React.PropTypes.number,
    type: React.PropTypes.oneOf(Object.keys(ICONS_TYPES)).isRequired,
    rotate: React.PropTypes.oneOfType([
      React.PropTypes.oneOf(Object.values(ROTATE_TYPES)),
      React.PropTypes.number,
    ]),
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
  }

  static defaultProps = {
    size: 0,
    rotate: ROTATE_TYPES.up,
    onClick: () => {},
    className: '',
  }

  render() {
    const {
      size,
      type,
      className,
      rotate,
      onClick,
    } = this.props

    const inlineStyle = {
      transform: `rotate(${typeof rotate === 'string' ? ROTATE_VALUES[rotate] : rotate}deg)`,
      width: size,
      height: size,
    }
    return (
      <div {...{
        className: `${style.root} ${className}`,
        style: inlineStyle,
        onClick,
      }} >
        {React.createElement(ICON_COMPS[type])}
      </div>
    )
  }
}

export default TIcon

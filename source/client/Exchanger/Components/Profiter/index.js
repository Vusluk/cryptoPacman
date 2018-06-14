import React from 'react'
import style from './index.css'
import { Link } from 'react-router'

const colorizer = (percent) => percent < 0 ? 'red' : percent < 2 ? 'yellow' : 'green'

import { calcProfit } from '../../lib'

const OrdersTable = ({
  orders = [],
  className = '',
  onSelect = () => {},
  selected = null,
}) => (
  <div className={style.orderTable}>
    {orders.map((order, key) => (
      <div className={key === selected ? `${style.order} ${style.selected}` : style.order} key={key} onClick={() => onSelect(order, key)}>
        <span>{order.price}</span>
        <span>{order.amount.toFixed(2)}</span>
      </div>
    ))}
  </div>
)

class Profiter extends React.PureComponent {
  
  constructor(props) {
    super(props)
    this.state = {
      selectedAsk: {
        exchange: this.props.ask.exchange,
        order: { price: this.props.ask.price, amount: 0 },
        index: null
      },
      selectedBid: {
        exchange: this.props.bid.exchange,
        order: { price: this.props.bid.price, amount: 0 },
        index: null
      },
    }
  }

  selectAsk (exchange, order, index) {
    this.setState({ selectedAsk: { exchange, order, index } })
  }

  selectBid (exchange, order, index) {
    this.setState({ selectedBid: { exchange, order, index } })
  }

  render () {
    const {
      exchanges = [],
      txFeeMax,
      pair = 'BTC',
      ask,
      bid,
      minTrading,

      actions,
      actionsApp,
      className,
    } = this.props
    const {
      selectedAsk,
      selectedBid,
    } = this.state
    
    const exchangesArr = Object.entries(exchanges).filter(([name, info]) => !!info.pairs[pair])
    const askBooks = exchangesArr
          .map(([name, info]) => ({ name, orders: info.pairs[pair].asks.length ? info.pairs[pair].asks.slice(0, 5) : [] }))
          .sort((a, b) => (a.orders[0] || {}).price - (b.orders[0] || {}).price)
    const bidBooks = exchangesArr
          .map(([name, info]) => ({ name, orders: info.pairs[pair].bids.length ? info.pairs[pair].bids.slice(0, 5) : [] }))
          .sort((a, b) => (a.orders[0] || {}).price - (b.orders[0] || {}).price)
    const profit = calcProfit(selectedAsk.order.price, selectedBid.order.price, 0.25, 0.25, txFeeMax, minTrading.amount)
    
    return (
      <div className={className ? `${style.root} ${className}` : style.root}>
        <div className={style.asks}>
          {askBooks.map((book, key) => (
            <div className={style.exchange} key={key}>
              <div className={style.name}>{book.name}</div>
              <OrdersTable {...{
                orders: book.orders,
                selected: book.name === selectedAsk.exchange ? selectedAsk.order : null,
                onSelect: (order, index) => this.selectAsk(book.name, order, index),
              }} />
            </div>
          ))}
        </div>
        <div className={style.profit}>
          <div className={`${style.profitPercent} ${style[colorizer(profit)]}`}>{profit}</div>
          <div className={style.profitPath}>
            <div><span>{selectedAsk.exchange}</span><span>{selectedBid.exchange}</span></div>
            <div><span>{selectedAsk.order.price}</span><span>{selectedBid.order.price}</span></div>
          </div>
          <div className={style.profitReserved}>RESERVED</div>
        </div>
        <div className={style.bids}>
          {bidBooks.map((book, key) => (
            <div className={style.exchange} key={key}>
              <div className={style.name}>{book.name}</div>
              <OrdersTable {...{
                orders: book.orders,
                selected: book.name === selectedBid.exchange ? selectedBid.order : null,
                onSelect: (order, index) => this.selectBid(book.name, order, index),
              }} />
            </div>
          ))}          
        </div>
      </div>
    )
  }
}

export default Profiter

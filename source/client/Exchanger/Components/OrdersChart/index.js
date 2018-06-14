import React from 'react'
import style from './index.css'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from 'recharts'
import { subPercent, addPercent } from '../../lib'

const CustomizedAxisTick = React.createClass({
  render () {
    const {x, y, stroke, payload} = this.props;
		
   	return (
    	<g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-15)">{payload.value}</text>
      </g>
    );
  }
})

const OrdersChart = ({
  orders = [],
  prices = {},
  className,
}) => (
  <div className={className ? `${style.root} ${className}` : style.root}>
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={orders} margin={{ top: 6, right: 6 }}>
        <XAxis dataKey="price" height={60} tick={<CustomizedAxisTick/>} domain={['auto', 'auto']} />
        <YAxis />
        <CartesianGrid strokeDasharray="1 3" />
        <ReferenceLine x={prices.ask} stroke="#cc6a00" label={prices.ask} />
        <Tooltip />
        <Line type="monotone" dataKey="bid" stroke="#54b685" dot={false} legendType={'none'} />
        <Line type="monotone" dataKey="ask" stroke="#832729" dot={false} legendType={'none'} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default OrdersChart

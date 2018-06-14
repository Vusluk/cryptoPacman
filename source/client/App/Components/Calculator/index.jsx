import React, { Component } from 'react'
import style from './index.css'
import moment from 'moment'
import Header from '../Header'

const GPU_TARGET = 18

class Calculator extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gpuTargetNumber: GPU_TARGET,
      gpuStartNumber: 4,
      gpuCost: 63000,
      startDate: moment().format('YYYY-MM-DD'),
      amountPerDay: 288,
      result: new Array(GPU_TARGET).fill({}),
    }
    this.onChange = this.onChange.bind(this)
    this.calculate = this.calculate.bind(this)
  }

  componentDidMount() {
    this.setState({ result: this.calculate()})
  }
  
  onChange(e, v) {
    const check = () => {
      const apd = this.state.amountPerDay
      const gc = this.state.gpuCost
      const gs = this.state.gpuStartNumber
      const gt = this.state.gpuTargetNumber
      return (apd < gc && gs < gt)
    }
    
    this.setState({[v]: e.target.value}, () => {
      if (check()) this.setState({ result: this.calculate()})
    })
  }

  calculate() {
    const startDate = this.state.startDate
    const amountPerDay = this.state.amountPerDay
    const gpuCost = this.state.gpuCost
    const gpuStartNumber = this.state.gpuStartNumber
    const gpuTargetNumber = this.state.gpuTargetNumber
    const newResult = new Array(+gpuTargetNumber - gpuStartNumber + 1).fill({})

    const findGpuBuy = (date, amount, credit) => {
      if (credit >= gpuCost) {
        return { date, credit: credit - gpuCost }
      }
      
      const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD')
      return findGpuBuy(nextDate, amount, credit + amount)
    }
	
    return newResult.reduce((acc, val, i, arr) => {
	    const amount = (+gpuStartNumber + i) * amountPerDay
	    if (i === 0) {
        return acc.concat({
          num: +gpuStartNumber,
          amount: amountPerDay * gpuStartNumber,
          date: startDate,
          credit: 0,
        })
      } else {
        const newGpu = findGpuBuy(acc[i-1].date, (+gpuStartNumber + i - 1) * amountPerDay, acc[i-1].credit)
        return acc.concat({
          num: +gpuStartNumber + i,
          amount: amount,
          date: newGpu.date,
          credit: newGpu.credit,		    
        })
	    }
    }, [])
  }
    
  render () {
    return (
      <div className={style.root}>
        <div className={style.inputs}>
          <div>
            <span className={style.inputTitle}>Стоймость GPU: </span>
            <input {...{
              value: this.state.gpuCost,
              onChange: (e) => this.onChange(e, 'gpuCost'),
            }} />
          </div>
          <div>
            <span className={style.inputTitle}>Текущее количество GPU: </span>
            <input {...{
              value: this.state.gpuStartNumber,
              onChange: (e) => this.onChange(e, 'gpuStartNumber'),
            }} />
          </div>
          <div>
            <span className={style.inputTitle}>Требуемое количество GPU: </span>
            <input {...{
              value: this.state.gpuTargetNumber,
              onChange: (e) => this.onChange(e, 'gpuTargetNumber'),
            }} />
          </div>
          <div>
            <span className={style.inputTitle}>Дата отсчета: </span>
            <input {...{
              value: this.state.startDate,
              onChange: (e) => this.onChange(e, 'startDate'),
              type: 'date',
            }} />
          </div>
          <div>
            <span className={style.inputTitle}>Прибыль в день: </span>
            <input {...{
              value: this.state.amountPerDay,
              onChange: (e) => this.onChange(e, 'amountPerDay'),
            }} />
          </div>
        </div>

        <table className={style.result}>
          <thead>
          <tr className={style.resultHeader}>
            <th>Количество GPU</th>
            <th>Дата покупки</th>
            <th>Прибыль в день</th>
            <th>Прибыль в месяц</th>
            <th>Прибыль в год</th>
            <th>Остаток</th>
          </tr>
          </thead>
          <tbody>
            {this.state.result.map((r, i) => (
              <tr className={style.resultBody} key={i}>
                <td>{r.num}</td>
                <td>{r.date}</td>
                <td>{r.amount}</td>
                <td>{r.amount * 30}</td>
                <td>{r.amount * 365}</td>
                <td>{r.credit}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    )
  }
}

export default Calculator

	    // <div>{moment('2017-12-30').diff(moment('2017-09-11'), 'days')}</div>

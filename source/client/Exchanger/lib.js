export const subPercent = (amount, percent) => amount - ((amount * percent) / 100)
export const addPercent = (amount, percent) => amount + ((amount * percent) / 100)
export const diffPercent = (from, to) => ((to * 100) / from) - 100

export const calcProfit = (fromPrice, toPrice, buyFee, sellFee, transferFee, dealAmount) => {
  const amount = dealAmount || (0.005 / fromPrice)
  const buy = subPercent((amount * fromPrice), buyFee) / fromPrice
  const transfer = buy - transferFee
  const sell = subPercent((transfer * toPrice), sellFee)
  return diffPercent((amount * fromPrice), sell).toFixed(2)
}
export const calcSubPercentDiff = (number, percent) => number - subPercent(number, percent)
export const calcAddPercentDiff = (number, percent) => addPercent(number, percent) - number
export const calcRange = (number, percent) => {
  const addedPercentDiff = calcAddPercentDiff(number, percent)
  return { from: number - addedPercentDiff, to: number + addedPercentDiff }
}

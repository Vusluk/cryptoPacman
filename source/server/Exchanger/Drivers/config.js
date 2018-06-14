const BASE_CURRENCIES_WHITE_LIST = ['BTC', 'ETH']
const EXCHANGES_WHITE_LIST = [
  'bittrex',
  'poloniex',
  'kraken',
  'livecoin',
  // 'yobit',
  // 'gatecoin',
  
  // 'hitbtc', //FUCK EXCHANGE
]
const UPDATE_CURRENCIES_INTERVAL = 3600000
const UPDATE_PRICES_INTERVAL = 60000

module.exports = {
  BASE_CURRENCIES_WHITE_LIST,
  EXCHANGES_WHITE_LIST,
  UPDATE_CURRENCIES_INTERVAL,
  UPDATE_PRICES_INTERVAL,
}

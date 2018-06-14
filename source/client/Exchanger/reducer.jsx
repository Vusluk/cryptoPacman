const init = {
  controls: {
    currency: '',
    txFee: 1,
    range: '/',
  },
}

const reducer = (state = init, action) => {
  switch (action.type) {
    case 'EXCHANGER_STARTED':
    return {
      ...state,
      exchanges: action.exchanges,
      currencies: action.currencies,
    }
    case 'EXCHANGER_EXCHANGES_UPDATED':
    return {
      ...state,
      exchanges: action.exchanges,
    }
    case 'EXCHANGER_CURRENCIES_UPDATED':
    return {
      ...state,
      currencies: {
        ...state.currencies,
        ...action.currencies
      },
    }
    case 'EXCHANGER_CURRENCY_UPDATED':
    return {
      ...state,
      currencies: {
        ...state.currencies,
        ...action.currency,
      },
    }
    default:
      return state
  }
}
export default reducer

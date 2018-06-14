import config from '../../config.json'

const { name } = config

export const writeStorage = ({ predicate, filter = [] }) => ({ getState }) => next => action => {
  const result = next(action)
  // exit early if predicate function returns false
  if (typeof predicate === 'function' && !predicate(getState, action)) {
    return result
  }

  const filtered = Object.entries(getState())
    .filter(([k]) => !filter.includes(k))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  const state = JSON.stringify(filtered)
  window.localStorage.setItem(name, state)
  return result
}

export const readStorage = () => {
  let state
  try {
    state = JSON.parse(window.localStorage.getItem(name))
  } catch (err) {
    console.log('[ARCH] READ_STORAGE_ERR -->>', err)
    // TODO saved data is not valid
  }
  return state || {}
}

export const clearStorage = () => {
  window.localStorage.removeItem(name)
}

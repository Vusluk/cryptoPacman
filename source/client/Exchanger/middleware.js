const middleware = store => next => action => {
  // if (action.type === '') console.log('', action)
  if (!action.io) return next(action)
  const nextMiddleware = next(action)
  
  const io = store.getState().app.io
  io.emit(action.type, action.io(store.getState().exchanger))
  return nextMiddleware
}

export default middleware

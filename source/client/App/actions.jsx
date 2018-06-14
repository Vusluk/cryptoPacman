import io from 'api'

export const init = () => (dispatch, getState) => {
  io.on('USER_UPDATED', (msg) => {
    if (msg.error) {
      dispatch({
        type: 'APP_API_ERROR',
        err: msg.data,
      })
    } else {
      dispatch({
        type: 'USER_UPDATE',
        data: msg.data,
      })
    }
  })
}

export const formChange = (form, field, value) => ({
  type: 'APP_FORM_CHANGE',
  form,
  field,
  value,
})

export const formClear = (form) => ({
  type: 'APP_FORM_CLEAR',
  form,
})

export const singUp = () => (dispatch, getState) => {
  const form = getState().app.getIn(['form', 'auth'], false).toJS()
  if (form && !!form.email && !!form.pass) api.emit('USER_SINGUP', form)
}

export const singIn = () => (dispatch, getState) => {
  const form = getState().app.getIn(['form', 'auth'], false).toJS()
  if (form && !!form.email && !!form.pass) api.emit('USER_SINGIN', form)
}

export const singOut = () => ({
  type: 'USER_UPDATE',
  data: {},
})

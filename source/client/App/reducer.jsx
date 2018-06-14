const formClear = {
  pending: false,
  error: false,
  fields: {},
}

const init = {
  forms: {},
  notifications: {},
  ui: {},
  auth: {},
}

const reducer = (state = init, action) => {
  switch (action.type) {
  case 'APP_FORM_CHANGE':
    const form = state.forms[action.form] || {}
    const fields = form.fields || {}
    const field = fields[action.field] || {}
    return {
      ...state,
      forms: {
        ...state.forms,
        [action.form]: {
          ...form,
          fields: {
            ...fields,
            [action.field]: {
              ...field,
              value: action.value,
            },
          },
        },
      },
    }
    case 'APP_FORM_CLEAR':
    return {
      ...state,
      forms: {
        ...state.forms,
        [action.form]: formClear,
      },
    }
    default:
      return state
  }
}
export default reducer

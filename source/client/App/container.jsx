import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Layout from './Layout'
import * as actions from './actions'

const provider = state => ({
  notifications: state.app.notifications,
  ui: state.app.ui,
  auth: state.app.auth,
})

const dispatchProvider = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
})

export default connect(provider, dispatchProvider)(Layout)

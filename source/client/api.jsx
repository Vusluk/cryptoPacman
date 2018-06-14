import config from '../../config.json'

const { server: { host, port } } = config
const uri = `${host}${port !== '' ? `:${port}` : ''}`

const socket = io.connect(uri)
socket.on('connect', () => {
  console.log('-->> IO.JS -->> ON -->> CONNECT')
})
socket.on('EXCHANGES_EXCHANGE_UPDATED', (data) => {
  console.log('-->> IO.JS -->> ON -->> EXCHANGES_EXCHANGE_UPDATED', data)
})

export default socket

console.log('-->> IO.JS');

const socket = io => {
  io.on('connection', (socket) => {
    console.log('-->> IO.JS -->> USER CONNECTED', socket.id);
    socket.on('reconnect', (number) => {
      console.log('-->> IO.JS -->> USER RECONNECTED', number);
    });
    socket.on('disconnect', (reason) => {
      console.log('-->> IO.JS -->> USER DISCONNECTED ', reason);
    });
    socket.on('error', (error) => {
      console.log('-->> IO.JS -->> ERROR ', error);
    }); 
  });
}

module.exports = socket

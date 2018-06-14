console.log('-->> SERVER.JS');

const path        = require('path');

const mongodb     = require('mongodb');
const mongoose    = require('mongoose');

const app         = require('express')();
const server      = require('http').Server(app);
const io          = require('socket.io')(server);

const devWebpackServer = require('./devWebpackServer.js');
const proxy = require('http-proxy').createProxyServer();

const NODE_ENV = process.env.NODE_ENV || 'development';
const env = {
  prod: NODE_ENV === 'production',
  dev: NODE_ENV === 'development',
}
const config = require('../../config.json')
const store = require('./store')(io) // ({ emit: io.emit, on: io.on })

// require('./db')(mongoose);
require('./app')(app);
require('./io')(io);

require('./Exchanger')(store, io)

if (env.dev) {
  console.log('-->> SERVER.JS -->> DEV-MODE');
  devWebpackServer(config.dev.port); //Запускаем WebpackDevServer
}

server.listen(config.server.port, () => {
  console.log('-->> SERVER.JS -->> SERVER RUNNING ON PORT ' + config.server.port);
});

proxy.on('error', (e) => {
  console.log('Could not connect to proxy, please try again...');
});

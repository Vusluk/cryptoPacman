const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./../../webpack.config.js');
const path = require('path');
const fs = require('fs');
const config = require('../../config')

module.exports = (port) => {
  console.log('-->> DEVWEBPACKSERVER.JS -->>');

  let bundleStart = null;
  const compiler = Webpack(webpackConfig);
  compiler.plugin('compile', function() {
    console.log('-->> DEVWEBPACKSERVER.JS: BUNDLING...');
    bundleStart = Date.now();
  });
  compiler.plugin('done', () => {
    console.log(`-->> DEVWEBPACKSERVER.JS: BUNDLED IN ${Date.now() - bundleStart} MS`);
  });

  const bundler = new WebpackDevServer(compiler, {
    publicPath: config.dev.publicPath,
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    },
    proxy: {
      '**': `${config.server.host}:${config.server.port}`
    }
  });

  bundler.listen(port, 'localhost', () => {
    console.log(`-->> DEVWEBPACKSERVER.JS: DEVWEBPACKSERVER RUNNING ON PORT ${port}`);
  });

};

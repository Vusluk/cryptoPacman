const path = require('path')
const webpack = require('webpack')
const cssimport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const config = require('./config')

const NODE_ENV = process.env.NODE_ENV || 'development';
const env = {
  prod: NODE_ENV === 'production',
  dev: NODE_ENV === 'development',
}

module.exports = {
  debug: env.dev,
  devtool: env.dev ? 'eval-source-map' : false,
  entry: env.prod ?
    './source/client/' :
    [
      `webpack-dev-server/client?${config.dev.host}:${config.dev.port}/`,
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './source/client/',
    ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: config.dev.publicPath,
  },
  module: {
    loaders: [
        { test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      }
      , { test: /\.jsx$/,
        loader: 'babel',
        exclude: /node_modules/,
      }
      , { test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      }
      , { test: /\.css$/,
        loader: env.dev ?
          'style-loader' +
          '!css-loader?modules' +
            '&localIdentName=[name]__[local]___[hash:base64:5]' +
          '!postcss-loader' :
          'style-loader' +
          '!css-loader?modules' +
            '&importLoaders=1' + '&localIdentName=[hash:base64:5]' +
          '!postcss-loader',
        exclude: /node_modules/,
      }
      , { test: /\.svg$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
        exclude: /node_modules/,
      }
      , { test: /\.png$/,
        loader: 'url-loader?limit=10000&mimetype=image/png',
        exclude: /node_modules/,
      }
      , { test: /\.gif$/,
        loader: 'url-loader?limit=10000&mimetype=image/gif',
        exclude: /node_modules/,
      }
      , { test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=styles/fonts/[name].[ext]',
        exclude: /node_modules/,
      },
    ],
  },
  postcss: [
    cssimport({
      path: ['source/client'],
    }),
    cssnext({
      browsers: env.dev ? ['last 2 Chrome versions'] : ['last 2 versions', 'ie 11'],
    }),
  ],
  resolve: {
    alias: {
    },
    modulesDirectories: [
      'node_modules',
      path.join(__dirname, 'source', 'client'),
    ],
    extensions: ['', '.js', '.jsx', '.json', '.css'],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        DEV: JSON.stringify(env.dev),
        NODE_ENV: `"${NODE_ENV}"`,
        API_HOST: process.env.API_HOST ? `"${process.env.API_HOST}"` : 'false',
      },
    }),
    new webpack.ProvidePlugin({
      key: 'keymaster',
    }),
  ].concat(env.dev ? [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ] : [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: { drop_console: true },
    }),
  ]),
}

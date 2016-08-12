var
  config = require('../src/config/dev'),
  G = {
    ADMINPATH: config.adminPath,
    __CLIENT__: true,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
  },
  path = require('path'),
  webpack = require('webpack'),
  WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'), // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  babelConfig = require('./babel.config')(G.__DEVELOPMENT__, G.__CLIENT__);

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: [
    'webpack-hot-middleware/client?path=http://' + config.webpackServer.host + ':' + config.webpackServer.port + '/__webpack_hmr',
    './src/client.js'
  ],
  output: {
    path: path.resolve(__dirname, '../resource/dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + config.webpackServer.host + ':' + config.webpackServer.port + '/static/dist/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelConfig)},
      { test: /\.json$/, loader: 'json'},
      { test: /\.less$/, loader: 'style!css!autoprefixer!less'},
      { test: /\.scss$/, loader: 'style!css!autoprefixer!sass'}
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    // global vars
    new webpack.DefinePlugin(G),
    // isomorphic
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools')).development()
  ]
};
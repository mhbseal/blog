var
  G = {
    ADMINPATH: require('../src/config/dev').adminPath,
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
  },
  path = require('path'),
  webpack = require('webpack'),
  WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'), // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  envConfig = require('../../env.config'),
  babelConfig = require('./babel.config')(G.__DEVELOPMENT__, G.__CLIENT__);

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '../..'),
  entry: [
    'webpack-hot-middleware/client?path=http://' + envConfig.dev.webpackServer.host + ':' + envConfig.dev.webpackServer.port + '/__webpack_hmr',
    './fe/src/client.js'
  ],
  output: {
    path: path.resolve(__dirname, '../../resource/static/dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + envConfig.dev.webpackServer.host + ':' + envConfig.dev.webpackServer.port + '/static/dist/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelConfig), 'eslint']},
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
    new webpack.DefinePlugin(G),

    // hot reload
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // isomorphic
    new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools')).development()
  ]
};

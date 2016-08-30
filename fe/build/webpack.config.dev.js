var
  G = {
    ADMINPATH: require('../src/config/dev').adminPath,
    __CLIENT__: true,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
  },
  path = require('path'),
  webpack = require('webpack'),
  CleanPlugin = require('clean-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'), // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  babelConfig = require('./babel.config')(G.__DEVELOPMENT__, G.__CLIENT__),
  root = path.resolve(__dirname, '..'),
  assetsPath = path.resolve(root, './resource/dist');

module.exports = {
  devtool: 'source-map',
  context: root,
  entry: {
    app: './src/client.js',
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux', 'redux-connect', 'classnames', 'superagent']
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelConfig)},
      { test: /\.json$/, loader: 'json' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass') }
    ]
  },
  postcss: function () {
    return [require('precss'), require('autoprefixer')];
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
    // for libs
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'libs-[hash].js',
      minChunks: Infinity
    }),

    new CleanPlugin([assetsPath], { root: root }),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),

    // set global vars
    new webpack.DefinePlugin(G),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),

    // isomorphic
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools')).development()
  ]
};
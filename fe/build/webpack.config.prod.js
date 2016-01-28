// for github
var adminPath;
try {
  adminPath = require('../src/config/prod').adminPath;
} catch(e) {};

var
  G = {
    ADMINPATH: adminPath || require('../src/config/dev').adminPath,
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
  },
  path = require('path'),
  webpack = require('webpack'),
  CleanPlugin = require('clean-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'), // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  babelConfig = require('./babel.config')(G.__DEVELOPMENT__, G.__CLIENT__),
  relativeAssetsPath = '../../resource/static/dist';

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '../..'),
  entry: {
    app: './fe/src/client.js',
    vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'redux-router', 'classnames', 'superagent']
  },
  output: {
    path: path.resolve(__dirname, relativeAssetsPath),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/static/dist/'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?' + JSON.stringify(babelConfig)},
      { test: /\.json$/, loader: 'json' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!less') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass') }
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
    // for libs
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'libs-[hash].js',
      minChunks: Infinity
    }),

    new webpack.DefinePlugin(G),
    new CleanPlugin([relativeAssetsPath]),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // isomorphic
    new WebpackIsomorphicToolsPlugin(require('./webpack.isomorphic.tools'))
  ]
};

var Express = require('express');
var webpack = require('webpack');

var envConfig = require('../../env.config');
var webpackConfig = require('./webpack.config.dev');
var compiler = webpack(webpackConfig);

var serverOptions = {
  contentBase: 'http://' + envConfig.dev.webpackServer.host + ':' + envConfig.dev.webpackServer.port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(envConfig.dev.webpackServer.port);

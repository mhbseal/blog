var Express = require('express');
var webpack = require('webpack');

var config = require('../src/config/dev');
var webpackConfig = require('./webpack.config.watch.js');
var compiler = webpack(webpackConfig);

var serverOptions = {
  contentBase: 'http://' + config.webpackServer.host + ':' + config.webpackServer.port,
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

app.listen(config.webpackServer.port, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('----\n==> webpackServer is running on http://%s:%s', config.webpackServer.host, config.webpackServer.port);
  }
});

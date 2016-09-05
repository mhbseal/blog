#!/usr/bin/env node
global.__CLIENT__ = false;
global.__DISABLE_SSR__ = true;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.ADMINPATH = require('../src/config').adminPath;

var
  path = require('path'),
  WebpackIsomorphicTools = require('webpack-isomorphic-tools'),
  babelConfig = require('../build/babel.config')(__DEVELOPMENT__, __CLIENT__);

require('babel-register')(babelConfig); // babel registration (runtime transpilation for node)

if (__DEVELOPMENT__) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../build/webpack.isomorphic.tools'))
  .development(__DEVELOPMENT__)
  .server(path.resolve(__dirname, '..'), function() {
    require('../src/server');
  });
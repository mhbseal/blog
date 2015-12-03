#!/usr/bin/env node
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.ADMINPATH = require('../fe/src/config/' + (__DEVELOPMENT__ ? 'dev' : 'prod')).adminPath;

var
  path = require('path'),
  WebpackIsomorphicTools = require('webpack-isomorphic-tools'),
  babelConfig = require('../fe/build/babel.config')(__DEVELOPMENT__, __CLIENT__);

require('babel/register')(babelConfig); // babel registration (runtime transpilation for node)

if (__DEVELOPMENT__) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../fe/build/webpack.isomorphic.tools'))
  .development(__DEVELOPMENT__)
  .server(path.resolve(__dirname, '..'), function() {
    require('../fe/src/server');
  });

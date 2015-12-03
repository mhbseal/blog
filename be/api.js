var
  express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieSession = require('cookie-session'),
  app = express();

/**
 * 全局变量
 * C 配置
 * M 数据model
 * F 方法
 */
global.C = require('./config');
global.M = {};
global.F = require(path.join(C.dir.controller, C.exceptFolder, 'funcs'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieSession(C.cookieSession));

require(path.join(C.dir.model, C.exceptFolder)); // model初始化入口
require(path.join(C.dir.controller, C.exceptFolder))(app); // router初始化入口

// 监听端口
app.listen(C.port);
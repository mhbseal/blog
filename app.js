var
  express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  cookieSession = require('cookie-session'),
  app = express();

/**
 * 全局变量
 * C 配置
 * M 数据model
 * F 方法
 */
global.C = require('./config')();
global.M = {};
global.F = require(path.join(C.dir.controller, C.exceptFolder, 'funcs'));

app.set('views', C.dir.view);
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(favicon(path.join(C.dir.resource, 'fe/static/images/favicon.ico')));
app.use(express.static(C.dir.resource, {maxAge: '365d'}));
app.use(cookieSession(C.cookieSession));

require(path.join(C.dir.model, C.exceptFolder)); // model初始化入口
require(path.join(C.dir.controller, C.exceptFolder))(app); // router初始化入口

// 监听端口
app.listen(C.port);
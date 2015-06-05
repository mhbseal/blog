var
	koa = require('koa'),
	path = require('path'),
	fs = require('fs'),
	bodyParser = require('koa-bodyparser'),
	favicon = require('koa-favicon'),
	serve = require('koa-static'),
	router = require('koa-router'),
	session = require('koa-session'),
	app = koa(),
	views = require('co-views'),
	render;

/**
 * 全局变量
 * C 配置
 * M 数据model
 * F 方法
 */
global.C = require('./config')(app);
global.M = {};
global.F = require(path.join(C.dir.controller, C.exceptDir, 'funcs'));

// 使用中一般间件
app.keys = C.secret;
app.use(session({key: 'blog'}, app));
app.use(bodyParser());
app.use(router(app));
// 模板引擎
render = views(C.dir.view, {
	map: {
		html: 'ejs'
	},
	default: 'ejs'
})
// 静态文件
app.use(serve(C.dir.resource));
app.use(favicon(path.join(C.dir.resource, 'static/images/favicon.ico')));

require(path.join(C.dir.model, C.exceptDir))(); // model初始化入口
require(path.join(C.dir.controller, C.exceptDir))(app, render); // router初始化入口

//404页面
app.use(function * pageNotFound() {
	this.body = yield render('404', {msg: '没有找到相关内容'})
});

// 监听端口
app.listen(C.port);
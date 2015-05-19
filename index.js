var
	koa = require('koa'),
	path = require('path'),
	fs = require('fs'),
	bodyParser = require('koa-bodyparser'),
	favicon = require('koa-favicon'),
	staticCache = require('koa-static-cache'),
	router = require('koa-router'),
	app = koa(),
	views = require('co-views'),
	fixPath = './global/',
	render;

/**
 * 全局变量
 * C 配置
 * M 数据model
 * S cookie缓存
 */

global.S = {
	admin : {} // 管理员
};

if (!~__dirname.indexOf('workspace')) app.env = 'production'; // 这里判断根目录路径是否包含'workspace',不包含则认为是生产环境
require(fixPath + 'config')(app, __dirname); // 引入C 配置

// 使用中一般间件
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
app.use(staticCache(C.dir.resource));
app.use(favicon(C.dir.resource + 'static/images/favicon.ico'));

require(fixPath + 'model')(fs); // model初始化入口
require(fixPath + 'router')(app, fs, render); // router初始化入口

// 监听端口
app.listen(C.port);
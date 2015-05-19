module.exports = function(fs) {
	var
		mongoose = require('mongoose'),
		Schema = mongoose.Schema;

	mongoose.connect(C.db.uri, C.db.opts); // 创建链接

	global.M = {}; // 全局model
	fs.readdirSync(C.dir.model).forEach(function (name) { // 遍历所有model
		name = name.replace('.js', '');
		M[name] =mongoose.model(name, new Schema(require(C.dir.model+ name)(Schema)));
	})
	// create data

	//M.admin.create({
	//	"name" : "mo",
	//	"password" : "123456"
	//});
	//M.articleType.create({
	//	"name" : "Web",
	//	"path" : "web",
	//	"enabled" : true,
	//	"level" : 1,
	//	'enabled': true
	//});
	//M.article.create({
	//	"title" : "一些web前端的页面优化方案13223433422",
	//	"author" : "Mo",
	//	"tags" : [{
	//		path: 'html',
	//		name: 'html'
	//
	//	}, {
	//		path: 'mobile',
	//		name: '手机'
	//	}],
	//	"createTime" : 1431489782086,
	//	"lastEditTime" : 1431489782086,
	//	"introduction" : "减少web页面的HTTP请求次数是web页面优化中最常见也是最重要的方式之一，这部分可以借助一些现成的前端构建工具去实现，例如Grunt。",
	//	"content" : "减少web页面的HTTP请求次数是web页面优化中最常见也是最重要的方式之一，这部分可以借助一些现成的前端构建工具去实现，例如Grunt。1",
	//	"enabled" : true,
	//	"type" : {
	//		"level" : 1,
	//		"name" : "Web",
	//		"path" : "web"
	//	},
	//	"visits" : 0,
	//	'enabled': true
	//});
	//M.link.create({
	//	"name" : "W3CPLus",
	//	url: "http://www.w3cplus.com"
	//});
	//M.tag.create({
	//	path: 'html',
	//	name: 'html'
	//});
};
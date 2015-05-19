module.exports = function(app, fs, render) {
	// 检验是否登陆
	function checkLogin(folderName) {
		return function* (next) {
			// 目录名名C.adminPath,并且请求的path与C.adminPath匹配,也就是说访问后台必须验证是否登陆
			if (folderName && folderName.indexOf(C.adminPath) && new RegExp('^' + C.adminPath + '(?!login)', 'i').test(this.path)) {
				var
					valueStr = this.cookies.get('admin'),
					valueObj;

				if (valueStr) { // 如果cookie存在
					valueObj = JSON.parse(decodeURIComponent(valueStr));
					if (S.admin[valueObj.name] === valueObj.password) { // 从缓存中匹配
						yield next;
					} else if (yield M.admin.findOne(valueObj)) { // 从缓存数据库中匹配
						S.admin[valueObj.name] = valueObj.password;
						yield next;
					} else {
						this.redirect(C.adminPath + "login");
					}
				} else {
					this.redirect(C.adminPath + "login");
				}
			} else {
				yield next;
			}
		}
	}
	// 遍历所有router
	function eachFiles(dir, folderName) {
		fs.readdirSync(dir).forEach(function (name) {
			if (/\.js$/.test(name)) {
				var router = require(dir + name)(render);
				if (router) {
					if (Array.isArray(router.method)) { // 如果controller.js中method为数组，则循环
						router.method.forEach(function(method) {
							app[method](router.path, checkLogin(folderName), router.handler[method]);
						})
					} else {
						app[router.method](router.path, checkLogin(folderName), router.handler);
					}
				}
			} else { // 如果是文件夹，则递归继续往下找
				eachFiles(dir + name + '/', name);
			}
		})
	}
	eachFiles(C.dir.controller);
};
module.exports = function (app, render) {
  var
    path = require('path'),
    fs = require('fs');

  // 检验是否登陆
  function checkLogin(folderName) {
    return function* (next) {
      // 目录名名C.adminPath,请求的path与C.adminPath匹配,且session校验不通过,也就是说访问后台必须验证是否登陆
      if (folderName && folderName.indexOf(C.adminPath) && !new RegExp('^' + C.adminPath + 'login', 'i').test(this.path) && !this.session.admin) {
        this.redirect(C.adminPath + "login");
      } else {
        yield next;
      }
    }
  }

  // 遍历所有router
  function eachFiles(dir, folderName) {
    fs.readdirSync(dir).forEach(function (name) {
      if (path.extname(name) !== '') {
        var router = require(path.join(dir, name))(render);
        if (router) {
          if (Array.isArray(router.method)) { // 如果controller.js中method为数组，则循环
            router.method.forEach(function (method) {
              app[method](router.path, checkLogin(folderName), router.handler[method]);
            })
          } else {
            app[router.method](router.path, checkLogin(folderName), router.handler);
          }
        }
      } else if (name !== C.exceptDir && name !== ".DS_Store") { // 如果是文件夹并且不等于排除目录，则递归继续往下找(".DS_Storeo"为mac缓存，老是自动生成，这里特殊处理)
        eachFiles(path.join(dir, name), name);
      }
    })
  }

  eachFiles(C.dir.controller);
};
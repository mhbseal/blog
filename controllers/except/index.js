module.exports = function (app) {
  var
    path = require('path'),
    fs = require('fs'),
    co = require('co');

  // 遍历controllers文件夹，执行所有router文件
  function eachFiles(dir) {
    fs.readdirSync(dir).forEach(function (name) {
      if (path.extname(name) !== '') {
        require(path.join(dir, name))(app, co);
      } else if (name !== C.exceptFolder && name !== '.DS_Store') { // 如果是文件夹并且不等于排除目录，则递归继续往下找(".DS_Storeo"为mac缓存，这里特殊处理)
        eachFiles(path.join(dir, name));
      }
    })
  }

  // 后台检验是否登陆
  app.all([C.adminPath, C.adminPath + '*'], function (req, res, next) {
    if (!req.session.admin && req.path != C.adminPath + 'login') {
      res.redirect(C.adminPath + 'login');
    }
    next();
  });

  // 遍历所有router
  eachFiles(C.dir.controller);

  // 404页面
  app.use(function(req, res) {
    res.render('404', {msg: '没有找到相关内容'})
  });
};
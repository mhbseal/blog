module.exports = function (app, co) {
  app // 欢迎页
    .route(C.adminPath)
    .get(function (req, res) {
      co(function *() {
        var blogInfo = (yield M.blogInfo.findOne()) || {};
        res.render('admin/welcome', {
          blogInfo: blogInfo,
          admin: req.session.admin || {}
        });
      })
    })
};
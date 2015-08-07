module.exports = function (app, co) {
  app // 登陆
    .route(C.adminPath + 'login')
    .get(function (req, res) {
      co(function *() {
        var
          blogInfo, conditions, admin,
          query = req.query;

        if (query.action === 'in') {
          if (req.session.admin) {
            msg = '已经登陆';
          } else {
            conditions = {
              email: query.email,
              password: F.encrypt(query.password)
            };
            if (admin = yield M.admin.findOne(conditions)) {
              msg = '登陆成功';
              req.session.admin = {
                id: admin._id,
                img: admin.img,
                name: admin.name,
                email: admin.email
              };
            } else {
              msg = '登陆失败';
            }
          }
          res.json({
            msg: msg
          })
        } else if (query.action === 'out') {
          req.session.admin = null;
          res.redirect('./login');
        } else {
          blogInfo = (yield M.blogInfo.findOne()) || {};
          res.render('admin/login', {
            blogInfo: blogInfo,
            admin: req.session.admin || {}
          });
        }
      })
    })
};
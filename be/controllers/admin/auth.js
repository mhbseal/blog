module.exports = function (app) {
  app // 登陆
    .route('/admin/auth')
    .get(function (req, res) {
      F.co(function *() {
        var
          conditions, admin,
          query = req.query;

        if (query.action === 'in') {
          var code = 0;
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
              code = 1;
              msg = '登陆失败';
            }
          }
          res.json({
            status: {
              code: code,
              msg: msg
            }
          })
        } else if (query.action === 'out') {
          req.session.admin = null;
          res.json({
            status: {
              code: 0,
              msg: '登出成功'
            }
          })
        } else {
          res.json({
            status: {
              code: 0,
              msg: 'success'
            },
            data: {
              admin: req.session.admin || {}
            }
          });
        }
      })
    })
};
module.exports = function (app, co) {
  app // 博客信息
    .route('/admin/blogInfo')
    .get(function (req, res) {
      co(function *() {
        // 渲染
        res.json({
          status: 'success',
          data: {
            logined: req.session.admin ? true : false,
            blogInfo: (yield M.blogInfo.findOne()) || {}
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
    .put(function (req, res) {
      co(function *() {
        res.json((yield M.blogInfo.findOneAndUpdate(req.body)) ?
          { status: 'success',
            msg: '更新成功'
          } : {
            status: 'fail',
            msg :'更新失败'
          });
      }).catch(F.handleErr.bind(null, res))
    })
    .post(function (req, res) {
      co(function *() {
        res.json((yield M.blogInfo.create(req.body)) ?
          { status: 'success',
            msg: '新增成功'
          } : {
            status: 'fail',
            msg :'新增失败'
          });
      }).catch(F.handleErr.bind(null, res))
    })
};
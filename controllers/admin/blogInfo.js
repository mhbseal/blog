module.exports = function (app, co) {
  app // 博客信息
    .route(C.adminPath + 'blogInfo')
    .get(function (req, res) {
      co(function *() {
        var blogInfo = (yield M.blogInfo.findOne()) || {};
        res.render('admin/blogInfo', {blogInfo: blogInfo});
      })
    })
    .put(function (req, res) {
      co(function *() {
        res.json({
          msg: (yield M.blogInfo.findOneAndUpdate(req.body)) ? '更新成功' : '更新失败'
        })
      })
    })
    .post(function (req, res) {
      co(function *() {
        res.json({
          msg: (yield M.blogInfo.create(req.request.body)) ? '新增成功' : '新增失败'
        })
      })
    })
};
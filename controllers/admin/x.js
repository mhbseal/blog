module.exports = function (app, co) {
  app // 通用详情CRUD
    .route(C.adminPath + ':x(link|articleType|articleTag|admin|comment|user|singlePage)')
    .get(function (req, res) {
      co(function *() {
        var
          x = req.params.x,
          id = req.query.id,
          blogInfo = (yield M.blogInfo.findOne()) || {},
          xData = id ? yield M[x].findOne({_id: id}) : {};

        // 是否调用编辑器
        blogInfo.useEditor = true;

        // 模板渲染
        res.render('admin/' + x, {
          blogInfo: blogInfo,
          xData: xData
        });
      })
    })
    .delete(function (req, res) {
      co(function *() {
        res.json({
          msg: (yield M[req.params.x].remove({_id: req.query.id})) ? '删除成功' : '删除失败'
        })
      })
    })
    .put(function (req, res) {
      co(function *() {
        var
          x = req.params.x,
          body = req.body;
        if (x === 'admin') body.password = F.encrypt(body.password);
        res.json({
          msg: (yield M[x].findOneAndUpdate({_id: req.query.id}, body)) ? '更新成功' : '更新失败'
        })
      })
    })
    .post(function (req, res) {
      co(function *() {
        var
          x = req.params.x,
          body = req.body;

        if (x === 'admin') {
          body.password = F.encrypt(body.password);
          body.img = '/upload/img/mo.jpg';
        }
        res.json({
          msg: (yield M[x].create(body)) ? '新增成功' : '新增失败'
        })
      })
    })
};
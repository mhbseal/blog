module.exports = function (app, co) {
  app // 文章详情CRUD
    .route(C.adminPath + 'article')
    .get(function (req, res) {
      co(function *() {
        var
          // 文章id
          id = req.query.id,
          // 文章所有type
          articleTypes = yield M.articleType.find({enabled: true}),
          // 文章内容
          article = id ? yield M.article.findOne({_id: id}) : {},
          // blog信息
          blogInfo = (yield M.blogInfo.findOne()) || {},
          // 标签
          articleTags = yield M.articleTag.find();

        // 是否调用编辑器
        blogInfo.useEditor = true;

        // 模板渲染
        res.render('admin/article', {
          articleTypes: articleTypes,
          blogInfo: blogInfo,
          article: article,
          articleTags: articleTags
        });
      })
    })
    .delete(function (req, res) {
      co(function *() {
        res.json({
          msg: (yield M.article.remove({_id: req.query.id})) ? '删除成功' : '删除失败'
        })
      })
    })
    .put(function (req, res) {
      co(function *() {
        var body = req.body;
        body.lastEditTime = F.date.format('YYYY-MM-DD HH:mm:ss');

        res.json({
          msg: (yield M.article.findOneAndUpdate({_id: req.query.id}, body)) ? '更新成功' : '更新失败'
        })
      })
    })
    .post(function (req, res) {
      co(function *() {
        var body = req.body;
        body.createTime = body.lastEditTime = F.date.format('YYYY-MM-DD HH:mm:ss');

        res.json({
          msg: (yield M.article.create(body)) ? '新增成功' : '新增失败'
        })
      })
    })
};
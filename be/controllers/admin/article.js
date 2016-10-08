module.exports = function (app) {
  app // 文章详情CRUD
    .route('/admin/article')
    .get(function (req, res) {
      F.co(function *() {
        var
          // 文章id
          id = req.query.id,
          // 文章所有type
          articleTypes = yield M.articleType.find({enabled: true}),
          // 文章内容
          article = id ? yield M.article.findOne({_id: id}) : {},
          // 标签
          articleTags = yield M.articleTag.find();

        // 模板渲染
        res.json({
          status: {
            code: 0,
            msg: 'success'
          },
          data: {
            articleTypes: articleTypes,
            article: article,
            articleTags: articleTags
          }
        });
      }, res)
    })
    .delete(function (req, res) {
      F.co(function *() {

        res.json((yield M.article.remove({_id: req.query.id})) ?
          {
            status: {
              code: 0,
              msg: '删除成功'
            }
          } : {
            status: {
              code: 1,
              msg: '删除失败'
            }
          });
      }, res)
    })
    .put(function (req, res) {
      F.co(function *() {
        var body = req.body;
        body.lastEditTime = F.date.format('YYYY-MM-DD HH:mm:ss');

        res.json((yield M.article.findOneAndUpdate({_id: req.query.id}, body)) ?
          {
            status: {
              code: 0,
                msg: '更新成功'
            }
          } : {
            status: {
              code: 1,
                msg: '更新失败'
            }
          });
      }, res)
    })
    .post(function (req, res) {
      F.co(function *() {
        var body = req.body;
        body.createTime = body.lastEditTime = F.date.format('YYYY-MM-DD HH:mm:ss');

        res.json((yield M.article.create(body)) ?
          {
            status: {
              code: 0,
                msg: '新增成功'
            }
          } : {
            status: {
              code: 1,
                msg: '新增失败'
            }
          });
      }, res)
    })
};
module.exports = function (render) {
  return {
    method: ['get', 'post', 'put', 'del'],
    path: C.adminPath + 'article', // 文章CRUD
    handler: {
      get: function* () {
        var
        // 文章id
          id = this.query.id,
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
        this.body = yield render('/admin/article', {
          articleTypes: articleTypes,
          blogInfo: blogInfo,
          article: article,
          articleTags: articleTags
        });
      },
      del: function* () {
        this.body = {
          msg: (yield M.article.remove({_id: this.query.id})) ? '删除成功' : '删除失败'
        }
      },
      put: function* () { // 更新
        var body = this.request.body;
        body.lastEditTime = F.date.format('YYYY-MM-DD HH:mm:ss');

        this.body = {
          msg: (yield M.article.findOneAndUpdate({_id: this.query.id}, this.request.body)) ? '更新成功' : '更新失败'
        }
      },
      post: function* () { // 新增
        var body = this.request.body;
        body.createTime = body.lastEditTime = F.date.format('YYYY-MM-DD HH:mm:ss');

        this.body = {
          msg: (yield M.article.create(this.request.body)) ? '新增成功' : '新增失败'
        }
      }
    }
  }
};
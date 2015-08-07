module.exports = function (app, co) {
  app // 单页面
    .route('/singlePage/:path')
    .get(function (req, res) {
      co(function *() {
        var
          blogInfo, articleTypes, links, articleTags, singlePage,
          path = req.params.path;

        // 文章所有type
        articleTypes = yield M.articleType.find({enabled: true});
        // 文章内容
        singlePage = (yield M.singlePage.findOne({'path': path})) || {};
        // blog信息
        blogInfo = (yield M.blogInfo.findOne()) || {};
        // 友情链接
        links = yield M.link.find();
        // 标签
        articleTags = yield M.articleTag.find();
        // 渲染
        res.render('singlePage', {
          articleTypes: articleTypes,
          blogInfo: blogInfo,
          singlePage: singlePage,
          links: links,
          articleTags: articleTags
        });
      })
    })
};
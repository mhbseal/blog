module.exports = function (app, co) {
  app
    .route('/layout')
    .get(function (req, res) {
      co(function *() {
        var
          blogInfo, articleTypes, articleTags, links;
        // 文章所有type
        articleTypes = yield M.articleType.find({enabled: true});
        // blog信息
        blogInfo = (yield M.blogInfo.findOne()) || {};
        // 标签
        articleTags = articleTags || (yield M.articleTag.find());
        // 友情链接
        links = yield M.link.find();
        // 渲染
        res.json({
          status: 'success',
          data: {
            articleTypes: articleTypes,
            blogInfo: blogInfo,
            links: links,
            articleTags: articleTags
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
};
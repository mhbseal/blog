module.exports = function (app, co) {
  app // 文章列表
    .route(C.adminPath + 'articleList')
    .get(function (req, res) {
      co(function *() {
        var
          blogInfo, articleTypes, articles, pageList, options,
          conditions = req.query,
          currentPage = +conditions.page || 1;

        // 过滤page参数
        delete conditions.page;
        // 文章所有type
        articleTypes = yield M.articleType.find({enabled: true});
        // 文章列表
        pageList = { // 文章列表分页
          size: 10, // 每页数据条数
          numRange: 4, // 当前页码前后页码范围
          current: currentPage || 1, // 当前页码
          path: C.adminPath + 'articleList' + '/?page=', // 链接地址
          rowCount: 0, // 数据总条数
          pageCount: 0 // 总页数
        };
        options = { // 文章查询限制
          limit: pageList.size,
          sort: {_id: -1},
          skip: (pageList.current - 1) * pageList.size
        };
        articles = yield M.article.find(conditions, null, options).populate('type tags');
        pageList.rowCount = yield M.article.count(conditions);
        pageList.pageCount = Math.ceil(pageList.rowCount / pageList.size);
        // blog信息
        blogInfo = (yield M.blogInfo.findOne()) || {};
        // 遍历文章，从评论的表中取相应的评论总数
        for (var article of articles) {
          article.commentCount = yield M.comment.count({'article.id': article._id});
        }
        // 模板渲染
        res.render('admin/articleList', {
          articleTypes: articleTypes,
          blogInfo: blogInfo,
          articles: articles,
          pageList: pageList,
          adminPath: C.adminPath
        });
      })
    })
};
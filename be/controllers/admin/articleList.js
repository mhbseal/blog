module.exports = function (app, co) {
  app // 文章列表
    .route('/admin/articleList')
    .get(function (req, res) {
      co(function *() {
        var
          articleTypes, articles, pageList, options,
          conditions = req.query,
          pageList = { // 页面pagelist显示
            current: +conditions.page || 1, // 当前页码
            numRange: 4, // 当前页码前后页码范围
            size: 10 // 每页数据条数
          };

        // 过滤page参数
        delete conditions.page;
        // 文章查询限制
        options = {
          limit: pageList.size,
          sort: {_id: -1},
          skip: (pageList.current - 1) * pageList.size
        };
        articles = yield M.article.find(conditions, null, options).populate('type tags');
        pageList.rowCount = yield M.article.count(conditions);
        pageList.pageCount = Math.ceil(pageList.rowCount / pageList.size);
        // 遍历文章，从评论的表中取相应的评论总数
        for (var article of articles) {
          article._doc.commentCount = yield M.comment.count({'article.id': article._id});
        }
        // 模板渲染
        res.json({
          status: 'success',
          data: {
            articles: articles,
            pageList: pageList
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
};
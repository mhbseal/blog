module.exports = function (app, co) {
  app // 通用列表页
    .route('/admin/list')
    .get(function (req, res) {
      co(function *() {
        var
          xData, options,
          conditions = req.query,
          x = conditions.x,
          pageList = { // 页面pagelist显示
            current: +conditions.page || 1, // 当前页码
            numRange: 4, // 当前页码前后页码范围
            size: 10 // 每页数据条数
          };

        // 删除无用参数
        delete conditions.page;
        delete conditions.x;
        // 文章查询限制
        options = {
          limit: pageList.size,
          sort: {_id: -1},
          skip: (pageList.current - 1) * pageList.size
        };
        if (x === 'comment') { // commentList需要联查
          xData = yield M[x].find(conditions, null, options).populate('admin user');
        } else {
          xData = yield M[x].find(conditions, null, options);
        }
        pageList.rowCount = yield M[x].count(conditions);
        pageList.pageCount = Math.ceil(pageList.rowCount / pageList.size);
        // 如果是userList需要commentCount字段
        if (x === 'user') {
          for (var user of xData) {
            user._doc.commentCount = yield M.comment.count({user: user._id});
          }
        }
        // 模板渲染
        res.json({
          status: 'success',
          data: {
            xData: xData,
            pageList: pageList
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
};
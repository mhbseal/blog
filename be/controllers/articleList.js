module.exports = function (app, co) {
  app
    .route('/articleList')
    .get(function (req, res) {
      co(function *() {
        var
          articleTypes, articles, typeOrTagName, pageList, options, articleTags, rKeyword, typeId, tagId,
          query = req.query,
          typePath = query.typePath,
          tagPath = query.tagPath,
          keyword = query.keyword,
          typePaths = [],
          tagPaths = [],
          conditions = {},
          pageList = { // 页面pagelist显示
            current: +query.page || 1, // 当前页码
            numRange: 4, // 当前页码前后页码范围
            size: 10 // 每页数据条数
          };

        if (tagPath) { // 走tag列表
          // 所有tag
          articleTags = yield M.articleTag.find();
          // 循环所有tag,来校验路由,和模板渲染做准备
          articleTags.forEach(function (v) {
            tagPaths.push(v.path);
            if (v.path === tagPath) {
              typeOrTagName = v.name + '_Tag';
              tagId = v._id;
            }
          });
          // 校验路由tagPath是否存在
          if (!~tagPaths.indexOf(tagPath)) return res.json({status: 'warnning', msg: '找不到相应的文章标签'});
          // 文章查询条件
          conditions['tags'] = {$all: tagId};
          pageList.query = {tagPath: tagPath};
        } else if (keyword != null) { // 搜索
          rKeyword = new RegExp(keyword, 'i');
          conditions['$or'] = [{'title': rKeyword}, {'introduction': rKeyword}, {'content': rKeyword}, {'type.name': rKeyword}, {'tags.name': rKeyword}];
          pageList.query = {keyword: keyword};
        } else if (typePath) { // type分类列表
          // 文章所有type
          articleTypes = yield M.articleType.find({enabled: true});
          // 循环文章所有type,来校验路由,和模板渲染做准备
          articleTypes.forEach(function (v) {
            typePaths.push(v.path);
            if (v.path === typePath) {
              typeOrTagName = v.name;
              typeId = v._id;
            }
          });
          // 校验路由typePath是否存在
          if (!~typePaths.indexOf(typePath)) return res.json({status: 'warnning', msg: '找不到相应的文章类型'});
          // 文章查询条件
          conditions['type'] = typeId;
          pageList.query = {typePath: typePath};
        }

        conditions.enabled = true;
        options = { // 文章查询限制
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
            typeOrTagName: typeOrTagName,
            articles: articles,
            pageList: pageList,
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
};
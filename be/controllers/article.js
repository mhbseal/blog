module.exports = function (app, co) {
  app
    .route('/article')
    .get(function (req, res) {
      co(function *() {
        var
          article, comments;

        // 文章内容
        article = yield M.article.findOneAndUpdate({_id: req.query.id, enabled: true}, {$inc: {visits: 1}}).populate('type tags');
        // 校验文章id是否存在
        if (!article) return res.json({status: 'warnning', msg: '找不到相应的文章内容'});
        // 点评
        comments = yield M.comment.find({'article.id': article._id}).sort({_id: -1}).populate('user admin');

        // 模板渲染
        res.json({
          status: 'success',
          data: {
            article: article,
            comments: comments,
            commenter: req.session.admin || req.session.user || {}
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
};
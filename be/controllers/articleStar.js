module.exports = function (app) {
  app // 文章点赞
    .route('/articleStar')
    .post(function (req, res) {
      F.co(function *() {
        var article = yield M.article.findOneAndUpdate({_id: req.query.id, enabled: true}, {$inc: {stars: 1}}).populate('type tags');
        // 校验文章id是否存在
        if (!article) {
          return res.json({
            status: {
              code: 3,
              msg: '找不到相应的文章'
            }
          });
        }

        res.json((a) ?
          {
            status: {
              code: 0,
                msg: '点赞成功'
            }
          } : {
            status: {
              code: 1,
                msg: '点赞失败'
            }
          });
      })
    })
};
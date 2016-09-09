module.exports = function (app) {
  app // 文章点赞
    .route('/articleStar')
    .post(function (req, res) {
      F.co(function *() {
        var a = yield M.article.findOneAndUpdate({_id: req.query.id, enabled: true}, {$inc: {stars: 1}}).populate('type tags');
        console.log(a);
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
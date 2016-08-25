module.exports = function (app) {
  app // 博客信息
    .route('/admin/blogInfo')
    .get(function (req, res) {
      F.co(function *() {
        // 渲染
        res.json({
          status: {
            code: 0,
            msg: 'success'
          },
          data: {
            logined: req.session.admin ? true : false,
            blogInfo: (yield M.blogInfo.findOne()) || {}
          }
        });
      })
    })
    .put(function (req, res) {
      F.co(function *() {
        res.json((yield M.blogInfo.findOneAndUpdate(req.body)) ?
          {
            status: {
              code: 0,
              msg: '更新成功'
            }
          } : {
            status: {
              code: 1,
              msg: '更新失败'
            }
          });
      })
    })
    .post(function (req, res) {
      F.co(function *() {
        res.json((yield M.blogInfo.create(req.body)) ?
          {
            status: {
              code: 0,
              msg: '新增成功'
            }
          } : {
            status: {
              code: 1,
              msg: '新增失败'
            }
          });
      })
    })
};
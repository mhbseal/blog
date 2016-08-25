module.exports = function (app) {
  app // 通用详情CRUD
    .route('/admin/detail')
    .get(function (req, res) {
      F.co(function *() {
        var
          id = req.query.id,
          x = req.query.x,
          xData = id ? yield M[x].findOne({_id: id}) : {};

        // 模板渲染
        res.json({
          status: {
            code: 0,
            msg: 'success'
          },
          data: {
            xData: xData,
            useEditor: x === 'singlePage' ? true : false
          }
        });
      })
    })
    .delete(function (req, res) {
      F.co(function *() {
        res.json((yield M[req.query.x].remove({_id: req.query.id})) ?
          {
            status: {
              code: 0,
              msg: '删除成功'
            }
          } : {
            status: {
              code: 1,
              msg: '删除失败'
            }
          });
      })
    })
    .put(function (req, res) {
      F.co(function *() {
        var
          x = req.query.x,
          body = req.body;
        if (x === 'admin') body.password = F.encrypt(body.password);

        res.json((yield M[x].findOneAndUpdate({_id: req.query.id}, body)) ?
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
        var
          x = req.query.x,
          body = req.body;

        if (x === 'admin') {
          body.password = F.encrypt(body.password);
          body.img = '/upload/img/mo.jpg';
        }

        res.json((yield M[x].create(body)) ?
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
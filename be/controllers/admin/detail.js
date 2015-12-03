module.exports = function (app, co) {
  app // 通用详情CRUD
    .route('/admin/detail')
    .get(function (req, res) {
      co(function *() {
        var
          id = req.query.id,
          x = req.query.x,
          xData = id ? yield M[x].findOne({_id: id}) : {};

        // 模板渲染
        res.json({
          status: 'success',
          data: {
            xData: xData,
            useEditor: x === 'singlePage' ? true : false
          }
        });
      }).catch(F.handleErr.bind(null, res))
    })
    .delete(function (req, res) {
      co(function *() {
        res.json((yield M[req.query.x].remove({_id: req.query.id})) ?
          { status: 'success',
            msg: '删除成功'
          } : {
            status: 'fail',
            msg :'删除失败'
          });

      }).catch(F.handleErr.bind(null, res))
    })
    .put(function (req, res) {
      co(function *() {
        var
          x = req.query.x,
          body = req.body;
        if (x === 'admin') body.password = F.encrypt(body.password);

        res.json((yield M[x].findOneAndUpdate({_id: req.query.id}, body)) ?
          { status: 'success',
            msg: '更新成功'
          } : {
            status: 'fail',
            msg :'更新失败'
          });
      }).catch(F.handleErr.bind(null, res))
    })
    .post(function (req, res) {
      co(function *() {
        var
          x = req.query.x,
          body = req.body;

        if (x === 'admin') {
          body.password = F.encrypt(body.password);
          body.img = '/upload/img/mo.jpg';
        }

        res.json((yield M[x].create(body)) ?
          { status: 'success',
            msg: '新增成功'
          } : {
            status: 'fail',
            msg :'新增失败'
          });
      }).catch(F.handleErr.bind(null, res))
    })
};
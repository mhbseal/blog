module.exports = function (app) {
  app
    .route('/singlePage')
    .get(function (req, res) {
      F.co(function *() {
        res.json({
          status: {
            code: 0,
            msg: 'success'
          },
          data: (yield M.singlePage.findOne({'path': req.query.path})) || {}
        });
      }, res)
    })
};
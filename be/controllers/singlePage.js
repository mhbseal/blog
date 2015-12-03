module.exports = function (app, co) {
  app
    .route('/singlePage')
    .get(function (req, res) {
      co(function *() {
        res.json({
          status: 'success',
          data: (yield M.singlePage.findOne({'path': req.query.path})) || {}
        });
      }).catch(F.handleErr.bind(null, res))
    })
};
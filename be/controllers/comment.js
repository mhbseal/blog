module.exports = function (app) {
  app
    .route('/comment')
    .post(function (req, res) {
      F.co(function *() {
        var
          body = req.body,
          session = req.session,
          user, admin, comment, status, data;

        if (admin = session.admin) { // 管理员
          body.admin = admin.id
        } else if ((user = session.user) && user.email === body.email) { // 如果user session存在并且输入框和session的email一致
          body.user = user.id
        } else { // 不存在session或者不一致，则查询，找不到则create
          user = (yield M.user.findOne({
              email: body.email
            })) || (yield M.user.create({
              img: '/upload/img/user.jpg',
              name: body.name,
              email: body.email
            }))
          body.user = user._id
          req.session.user = {
            id: user._id,
            img: user.img,
            name: user.name,
            email: user.email
          };
        }
        // 时间
        body.time = F.date.format('YYYY-MM-DD HH:mm:ss');
        // 返回渲染数据
        if (comment = yield M.comment.create(body)) {
          data = {
            content: comment.content,
            time: comment.time
          };
          if (user) {
            data.user = {
              img: user.img,
              name: user.name
            };
          } else {
            data.admin = {
              img: admin.img,
              name: admin.name
            };
          }
          status = {
            code: 0,
            msg: '评论成功！'
          }
        } else {
          status = {
            code: 1,
            msg: '网络错误，请重试！'
          }
        }
        res.json({
          status: status,
          data: data
        })
      }, res)
    })
};
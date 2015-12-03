module.exports = function (app, co) {
  app
    .route('/comment')
    .post(function (req, res) {
      co(function *() {
        var
          body = req.body,
          session = req.session,
          user, admin, comment, status, msg, data;

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
          status = 'success';
          msg = '评论成功！';
        } else {
          status = 'fail';
          msg = '网络错误，请重试！'
        }
        res.json({
          status: status,
          msg: msg,
          data: data
        })
      }).catch(F.handleErr.bind(null, res))
    })
};
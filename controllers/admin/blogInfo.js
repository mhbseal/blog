module.exports = function (render) {
  return {
    method: ['get', 'post', 'put'],
    path: C.adminPath + 'blogInfo',
    handler: {
      get: function* () {
        var blogInfo = (yield M.blogInfo.findOne()) || {};
        this.body = yield render('/admin/blogInfo', {blogInfo: blogInfo});
      },
      put: function* () { // 更新
        this.body = {
          msg: (yield M.blogInfo.findOneAndUpdate(this.request.body)) ? '更新成功' : '更新失败'
        }
      },
      post: function* () { // 新增
        this.body = {
          msg: (yield M.blogInfo.create(this.request.body)) ? '新增成功' : '新增失败'
        }
      }
    }
  }
};
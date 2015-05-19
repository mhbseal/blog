module.exports = function(render) {
	return {
		method: ['get', 'put'],
		path: C.adminPath + 'blogInfo',
		handler: {
			get: function* () {
				var blogInfo = yield M.blogInfo.findOne();
				this.body = yield render(C.adminPath + 'blogInfo', {blogInfo: blogInfo});
			},
			put: function* () { // 更新
				this.body = {
					msg: (yield M.blogInfo.findOneAndUpdate(this.request.body)) ? '更新成功' : '更新失败'
				}
			}
		}
	}
};
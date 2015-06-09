module.exports = function(render) {
	return {
		method: 'get',
		path: C.adminPath,
		handler: function* () {
			var blogInfo = (yield M.blogInfo.findOne()) || {};
			this.body = yield render('/admin/welcome', {
				blogInfo: blogInfo,
				admin: this.session.admin || {}
			});
		}
	}
};
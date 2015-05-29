module.exports = function(render) {
	return {
		method: 'get',
		path: C.adminPath + 'login',
		handler: function* () {
			var
				blogInfo, conditions, admin,
				query = this.query;
			if (query.action === 'in') {
				if (this.session.admin) {
					msg = '已经登陆';
				} else {
					conditions = {
						name: query.name,
						password: F.encrypt(query.password)
					};
					if (admin = yield M.admin.findOne(conditions)) {
						msg = '登陆成功';
						conditions.email = admin.email;
						this.session.admin = conditions;
					} else {
						msg = '登陆失败';
					}
				}
				this.body = {
					msg: msg
				}
			} else if (query.action === 'out') {
				this.session.admin = null;
				this.redirect('./login');
			} else {
				blogInfo = yield M.blogInfo.findOne();
				this.body = yield render(C.adminPath + 'login', {
					blogInfo: blogInfo,
					admin: this.session.admin || {}
				});
			}
		}
	}
};
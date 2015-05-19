module.exports = function(render) {
	return {
		method: 'get',
		path: C.adminPath + 'login',
		handler: function* () {
			var
				blogInfo, conditions, crypto,
				query = this.query;
			if (query.action === 'in') {
				crypto = require('crypto');
				conditions = {
					name: query.name,
					password: crypto.createHash('md5').update(query.password).digest('hex')
				};
				if (yield M.admin.findOne(conditions)) {
					msg = '登陆成功';
					this.cookies.set('admin', encodeURIComponent(JSON.stringify(conditions)));
					S.admin[conditions.name] = conditions.password;
				} else {
					msg = '登陆失败';
				}
				this.body = {
					msg: msg
				}
			} else if (query.action === 'out') {
				this.cookies.set('admin', null);
				this.redirect('./login');
			} else {
				blogInfo = yield M.blogInfo.findOne();
				blogInfo.isLogin = true; // 这里把是否为登陆页的字段挂在blogInfo中
				this.body = yield render(C.adminPath + 'login', {blogInfo: blogInfo});
			}
		}
	}
};
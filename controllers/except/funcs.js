var
	funcs,
	crypto = require('crypto'),
	requirejs = require('requirejs');

// 引入mo.js
requirejs(C.dir.resource + '/fe/static/scripts/mo-0.1.0.js');

funcs = {
	// 管理员账号加密
	encrypt: function(pwd) {
		return crypto.createHash('md5').update(pwd).digest('hex');
	},
	date: requirejs('date')
}
module.exports = funcs;
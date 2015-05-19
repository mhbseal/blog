module.exports = function(app, root) {
	if (app.env === 'development') { // 开发环境
		global.C = {
			port: 3000, // 程序端口
			dir: { // 目录配置
				root: root,
				model: root + '/models/',
				view:  root + '/views/',
				controller:  root + '/controllers/',
				resource:  root + '/resource/',
				lib:  root + '/libs/'
			},
			db: { // 数据库配置
				uri: 'mongodb://localhost:27017/blog',
				opts: {
					user: '',
					pass: ''
				}
			},
			adminPath: '/admin/' // 后台路径
		}
	} else { // 生产环境

	}
}
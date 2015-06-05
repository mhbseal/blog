module.exports = function(app) {
	var
		path = require('path'),
		root = path.dirname(__dirname),
		resourceDir = path.join(root, 'resource'),
		db, config;

	// 这里判断根目录路径是否包含'workspace',不包含则认为是生产环境
	if (!~__dirname.indexOf('workspace')) app.env = 'production';

	if (app.env === 'development') { // 开发环境
		db = { // 数据库配置
			uri: 'mongodb://localhost:27017/blog',
			opts: {
				user: '',
				pass: ''
			}
		}
	} else { // 生产环境
		db = {

		}
	}

	config = {
		secret: ["Mo's Blog"], // session 秘钥
		db: db, // 数据库配置
		port: 3000, // 程序端口
		dir: { // 目录配置
			root: root,
			model: path.join(root, 'models'),
			view: path.join(root, 'views'),
			controller: path.join(root, 'controllers'),
			resource: resourceDir,
			lib: path.join(root, 'libs'),
			upload: path.join(resourceDir, 'upload')
		},
		adminPath: '/admin/', // 后台路径
		exceptDir: 'except' // model 和 controller 中read dir排除的目录名称
	}

	return config;
}
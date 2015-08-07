var
  path = require('path'),
  root = path.dirname(__dirname),
  resourceDir = path.join(root, 'resource'),
  config = {
    cookieSession: { // session
      name: 'blog',
      keys: ["Mo's Blog"]
    },
    db: { // 数据库配置
      uri: 'mongodb://localhost:27017/blog',
      opts: {
        user: '',
        pass: ''
      }
    },
    port: 3000, // 程序端口
    dir: { // 目录配置
      root: root,
      model: path.join(root, 'models'),
      view: path.join(root, 'views'),
      controller: path.join(root, 'controllers'),
      resource: resourceDir,
      lib: path.join(root, 'libs')
    },
    adminPath: '/admin/', // 后台路径
    uploadPath: '/upload/', // 上传文件路径
    uploadFixUrl: 'http://localhost:3000', // 上传文件web访问修正路径
    exceptFolder: 'except' // model 和 controller 中read dir排除的目录名称
  };

module.exports = config;





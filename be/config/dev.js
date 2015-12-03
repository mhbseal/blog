var
  path = require('path'),
  beRoot = path.resolve(__dirname, '..'),
  envConfig = require('../../env.config').dev.apiServer,
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
    port: envConfig.port, // 程序端口
    dir: { // 目录配置
      root: beRoot,
      model: path.resolve(beRoot, 'models'),
      controller: path.resolve(beRoot, 'controllers'),
      resource: path.resolve(beRoot, '../resource')
    },
    resourceFixUrl: '', // 静态资源web访问修正路径
    exceptFolder: 'except' // model 和 controller 中read dir排除的目录名称
  };

module.exports = config;





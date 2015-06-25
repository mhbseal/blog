module.exports = function () {
  var
    path = require('path'),
    root = path.dirname(__dirname),
    resourceDir = path.join(root, 'resource');

  return {
    secret: ["Mo's Blog"], // session 秘钥
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
      lib: path.join(root, 'libs'),
      upload: path.join(resourceDir, 'upload')
    },
    adminPath: '/admin/', // 后台路径
    uploadFixUrl: 'http://localhost:3000', // 上传文件修正路径，上传文件是根据当前domain生成的静态路径，所以这里修正固定唯一一个地址好点
    exceptDir: 'except' // model 和 controller 中read dir排除的目录名称
  };

};
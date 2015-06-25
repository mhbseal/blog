module.exports = function () {
  // 这里判断根目录路径是否包含'workspace'，不包含则认为是生产环境，则引入生产config
  return require('./' + (~__dirname.indexOf('workspace') ? 'default' : 'server'))()
};
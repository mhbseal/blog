module.exports = function () {
  // 根据不同环境引入对应的config
  return require('./' + (process.env.NODE_ENV === 'production' ? 'prod' : 'dev'))
};
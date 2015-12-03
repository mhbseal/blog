// 根据不同环境引入对应的config
module.exports = require('./' + (process.env.NODE_ENV === 'production' ? 'prod' : 'dev'));
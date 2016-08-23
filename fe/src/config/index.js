// 根据不同环境引入对应的config
module.exports = require('./' + (!__DEVELOPMENT__ ? 'prod' : 'dev'));

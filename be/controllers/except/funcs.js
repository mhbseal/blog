var
  funcs,
  crypto = require('crypto'),
  co = require('co');

funcs = {
  // 管理员账号加密
  encrypt: function (pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
  },
  // 格式化日期
  date: require('mo2js').date,
  // wrap co
  co: function(success, res) {
    co(success).catch(function (err) {
      // 统一服务错误处理
      res.status(500);
      res.json({
        status: {
          code: 2,
          msg: 'error'
        },
        data: err.stack
      })
    })
  },
  // node命令中的参数
  argv: require('minimist')(process.argv.slice(2))
}

module.exports = funcs;
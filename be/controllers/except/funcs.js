var
  funcs,
  crypto = require('crypto');

funcs = {
  // 管理员账号加密
  encrypt: function (pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
  },
  // 格式化日期
  date: require('mo2js').date,
  // 统一服务错误处理
  handleErr: function (res, err) {
    res.status(500);
    res.json({
      error: err
    })
  }
}

module.exports = funcs;
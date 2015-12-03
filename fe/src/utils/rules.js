export default {
  // 必填
  isRequired: function (val) {
    return val !== ''
  },
  // 邮箱
  isEmail: function (val) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val)
  },
  // 网址
  isUrl: function (val) {
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val)
  }
};

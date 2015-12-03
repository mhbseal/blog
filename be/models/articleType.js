module.exports = function () {
  return {// type层级这个目前暂时都是1级,所以没用,留着备用,对应字段level,parent
    level: Number,
    parent: String,
    name: String,
    path: String,
    enabled: Boolean
  }
}
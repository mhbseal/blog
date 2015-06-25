module.exports = function (Schema) {
  return {
    title: String,
    author: String,
    visits: {
      type: Number,
      default: 0
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: 'articleType'
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'articleTag'
    }],
    createTime: String,
    lastEditTime: String,
    enabled: Boolean,
    introduction: String,
    content: String
  }
}
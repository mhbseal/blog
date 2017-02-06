module.exports = function (Schema) {
  return {
    articleId: Schema.Types.ObjectId,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'admin'
    },
    time: String,
    content: String,
    enabled: Boolean
  }
}
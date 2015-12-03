module.exports = function (Schema) {
  return {
    article: {
      id: Schema.Types.ObjectId,
      typePath: String
    },
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
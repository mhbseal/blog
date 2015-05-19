module.exports = function (Schema) {
	return {
		articleId: Schema.Types.ObjectId,
		author: String,
		email: String,
		time: Date,
		enabled: Boolean,
		content: String
	}
}
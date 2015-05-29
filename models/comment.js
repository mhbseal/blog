module.exports = function (Schema) {
	return {
		article: {
			type: Schema.Types.ObjectId,
			ref: 'article'
		},
		name: String,
		email: String,
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		admin: {
			type: Schema.Types.ObjectId,
			ref: 'admin'
		},
		time: Date,
		content: String
	}
}
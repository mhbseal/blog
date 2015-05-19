module.exports = function () {
	return {
		title: String,
		author: String,
		visits: {
			type: Number,
			default: 0
		},
		type: {
			level: Number,
			parent: String,
			name: String,
			path: String
		},
		tags: [{
			path: String,
			name: String
		}],
		createTime: Date,
		lastEditTime: Date,
		enabled: Boolean,
		introduction: String,
		content: String
	}
}
module.exports = function(render) {
	return {
		method: 'get',
		path: new RegExp('^\\/((?!tag|search|' + C.adminPath + ')\\w+)\\/(\\w+)$'), // 文章详情页
		handler: function* () {
			var
				blogInfo, articleTypes, article, comment, view, links,  articleTags,
				id = this.captures[1]
				typePath = this.captures[0],
				typePaths = [];

			// 文章所有type
			articleTypes = yield M.articleType.find({enabled: true});
			// 循环文章所有type,来校验路由,和模板渲染做准备
			articleTypes.forEach(function(v) {
				typePaths.push(v.path);
			});
			// 校验路由typePath是否存在
			if (!~typePaths.indexOf(typePath)) view = '404';
			// 文章内容
			article = yield M.article.findOne({_id: id, enabled: true});
			// 校验文章id是否存在
			if (!article) return this.body = yield render('404', {msg: '找不到相应的文章内容'});
			// blog信息
			blogInfo = yield M.blogInfo.findOne();
			// 点评信息
			comment = yield M.comment.find({articleId: article._id});
			// 友情链接
			links = yield M.link.find();
			// 标签
			articleTags = yield M.articleTag.find();
			// 模板渲染
			this.body = yield render('articleDetail', {
				articleTypes: articleTypes,
				blogInfo: blogInfo,
				article : article,
				comment: comment,
				links: links,
				articleTags: articleTags
			});
		}
	}
};
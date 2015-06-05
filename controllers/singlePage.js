module.exports = function(render) {
	return {
		method: 'get',
		path:'/singlePage/:path', // 单页面
		handler: function* () {
			var
				blogInfo, articleTypes, article, links,  articleTags,
				path = this.params.path;

			// 文章所有type
			articleTypes = yield M.articleType.find({enabled: true});
			// 文章内容
			singlePage = yield M.singlePage.findOne({'path': path});
			// blog信息
			blogInfo = (yield M.blogInfo.findOne()) || {};
			// 友情链接
			links = yield M.link.find();
			// 标签
			articleTags = yield M.articleTag.find();
			// 模板渲染
			this.body = yield render('singlePage', {
				articleTypes: articleTypes,
				blogInfo: blogInfo,
				singlePage : singlePage,
				links: links,
				articleTags: articleTags
			});
		}
	}
};
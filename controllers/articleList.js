module.exports = function(render) {
	return {
		method: 'get',
		path: [new RegExp('^\\/((?!tag|comment|' + C.adminPath + ')\\w+)?$'), '/tag/:tagPath'], // 首页、type列表页、tag列表页、搜索
		handler: function* () {
			var
				blogInfo, articleTypes, articles, typeOrTagName, pageList, options, links,  articleTags, pageListPath, rKeyword,
				typePath = this.captures[0],
				tagPath = this.params.tagPath,
				keyword = this.query.kw,
				typePaths = [],
				tagPaths = [],
				conditions = {};

			// 文章所有type
			articleTypes = yield M.articleType.find({enabled: true});

			if (tagPath) { // 走tag列表
				// 所有tag
				articleTags = yield M.articleTag.find();
				// 循环所有tag,来校验路由,和模板渲染做准备
				articleTags.forEach(function(v) {
					tagPaths.push(v.path);
					if (v.path === tagPath) typeOrTagName = v.name + '_Tag'
				});
				// 校验路由tagPath是否存在
				if (!~tagPaths.indexOf(tagPath)) return this.body = yield render('404', {msg: '找不到相应的文章标签'});
				// 文章查询条件
				conditions['tags'] = {
					$elemMatch: {
						path: tagPath
					}
				};
				pageListPath = '/tag/' + tagPath + '?page=';
			} else if (typePath === 'search') { // 搜索
				rKeyword = new RegExp(keyword, 'i');
				conditions['$or'] = [{'title': rKeyword}, {'introduction': rKeyword}, {'content': rKeyword}, {'type.name': rKeyword}, {'tags.name': rKeyword}];
				pageListPath = '/' + typePath + '?kw=' + keyword + '&page=';
			} else { // type分类列表
				// 循环文章所有type,来校验路由,和模板渲染做准备
				articleTypes.forEach(function(v) {
					typePaths.push(v.path);
					if (v.path === typePath) typeOrTagName = v.name
				});
				if (typePath) { // 非首页
					// 校验路由typePath是否存在
					if (!~typePaths.indexOf(typePath)) return this.body = yield render('404', {msg: '找不到相应的文章类型'});
					// 文章查询条件
					conditions['type.path'] = typePath;
					pageListPath = '/' + typePath + '?page=';
				} else {
					pageListPath = '?page=';
				}
			}

			// 文章列表
			pageList = { // 文章列表分页
				size: 10, // 每页数据条数
				numRange: 4, // 当前页码前后页码范围
				current: +this.query.page || 1, // 当前页码
				path: pageListPath, // 链接地址
				rowCount: 0, // 数据总条数
				pageCount: 0 // 总页数
			};
			conditions.enabled = true;
			options = { // 文章查询限制
				limit: pageList.size,
				sort: {_id: -1},
				skip: (pageList.current - 1) * pageList.size
			};
			articles = yield M.article.find(conditions, null, options).populate('type tags');
			pageList.rowCount = yield M.article.count(conditions);
			pageList.pageCount = Math.ceil(pageList.rowCount/pageList.size);
			// blog信息
			blogInfo = yield M.blogInfo.findOne();
			// 这里把搜索的关键字字段挂在blogInfo下
			blogInfo.keyword = keyword
			// 友情链接
			links = yield M.link.find();
			// 标签
			articleTags = articleTags || (yield M.articleTag.find());
			// 遍历文章，从评论的表中取相应的评论总数
			for (var article of articles) {
				article.commentCount = yield M.comment.count({articleId: article._id});
			}
			// 模板渲染
			this.body = yield render('articleList', {
				articleTypes: articleTypes,
				blogInfo: blogInfo,
				typeOrTagName: typeOrTagName,
				articles : articles,
				pageList: pageList,
				links: links,
				articleTags: articleTags
			});
		}
	}
};
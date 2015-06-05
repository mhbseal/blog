module.exports = function(render) {
	return {
		method: 'get',
		path: C.adminPath + ':x(link|articleType|articleTag|admin|comment|user|singlePage)List',
		handler: function* () {
			var
				blogInfo, xData, pageList, options,
				x = this.params.x,
				conditions = this.query,
				currentPage = +conditions.page || 1;

			// 过滤page参数
			delete conditions.page;
			// 文章列表
			pageList = { // 文章列表分页
				size: 10, // 每页数据条数
				numRange: 4, // 当前页码前后页码范围
				current: currentPage, // 当前页码
				path: C.adminPath + x + 'List' + '/?page=', // 链接地址
				rowCount: 0, // 数据总条数
				pageCount: 0 // 总页数
			};
			options = { // 文章查询限制
				limit: pageList.size,
				sort: {_id: -1},
				skip: (pageList.current - 1) * pageList.size
			};
			if (x === 'comment') { // commentList需要联查
				xData = yield M[x].find(conditions, null, options).populate('admin user');
			} else {
				xData = yield M[x].find(conditions, null, options);
			}
			pageList.rowCount = yield M[x].count(conditions);
			pageList.pageCount = Math.ceil(pageList.rowCount / pageList.size);
			// 如果是userList需要commentCount字段
			if (x === 'user') {
				for (var user of xData) {
					user.commentCount = yield M.comment.count({user: user._id});
				}
			}
			// blog信息
			blogInfo = (yield M.blogInfo.findOne()) || {};
			// 模板渲染
			this.body = yield render('/admin/' + x + 'List', {
				blogInfo: blogInfo,
				xData: xData,
				pageList: pageList,
				adminPath: C.adminPath
			});
		}
	}
};
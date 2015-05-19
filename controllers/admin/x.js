module.exports = function(render) {
	return {
		method: ['get', 'post', 'put', 'del'],
		path: C.adminPath + ':x(link|articleType|articleTag)',
		handler: {
			get: function* () {
				var
					x = this.params.x,
					id = this.query.id,
					blogInfo = yield M.blogInfo.findOne(),
					xData = id ? yield M[x].findOne({_id: id}) : {};

				// 模板渲染
				this.body = yield render(C.adminPath + x, {
					blogInfo: blogInfo,
					xData: xData
				});
			},
			del: function* () {
				this.body = {
					msg: (yield M[this.params.x].remove({_id: this.query.id})) ? '删除成功' : '删除失败'
				}
			},
			put: function* () { // 更新
				this.body = {
					msg: (yield M[this.params.x].findOneAndUpdate({_id:  this.query.id}, this.request.body)) ? '更新成功' : '更新失败'
				}
			},
			post: function* () { // 新增
				this.body = {
					msg: (yield M[this.params.x].create(this.request.body)) ? '新增成功' : '新增失败'
				}
			}
		}
	}
};
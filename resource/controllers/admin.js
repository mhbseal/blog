$(function() {
	// 文章、文章标签、文章类型、友情链接、博客信息 的编辑和删除
	$.each(['article', 'articleTag', 'articleType', 'link', 'blogInfo', 'admin', 'comment', 'user'], function(i, x) {
		var
			introEditor, contentEditor,
			data = {},
			$x = $('#' + x), // 编辑页
			xList = x + 'List'; // 列表页

		// 编辑器初始化
		if ($x.length && x === 'article') {
			introEditor = UM.getEditor('introduction');
			contentEditor = UM.getEditor('content');
		}

		$x.find('a').click(function(e) {
			$x.find('[name]').each(function() { // 遍历表单中的输入项,赋值给data
				var $this = $(this);
				data[$this.attr('name')] = $this.val();
			})
			// 编辑器这里特殊处理
			if (x === 'article') {
				data.introduction = introEditor.getContent();
				data.content = contentEditor.getContent();
			}
			$.ajax({
				type: $(e.target).data('id') ? 'put' : 'post',
				url: location.href,
				data: data,
				success: function(data) {
					alert(data.msg);
					if (x !== 'blogInfo') location.href = './' + xList;
				}
			})
		})
		$('#' + xList).find('.js_delete').click(function(e) { // 删除
			$.ajax({
				type: 'delete',
				url: $(e.target).data('href'),
				success: function(data) {
					alert(data.msg);
					location.reload();
				}
			})
		})
	})
	// 登陆页
	var $login = $('#login');
	$login.find('#submit').click(function(e) {
		$.ajax({
			type: 'get',
			url: $(e.target).data('href'),
			data: {
				name: $login.find('#name').val(),
				password: $login.find('#password').val()
			},
			success: function(data) {
				if (data.msg === '已经登陆') {

				} else {
					alert(data.msg);
					if (data.msg === '登陆成功') {
						location.href = './articleList';
					}
				}
			}
		})
	})
	// 编辑器全屏兼容
	$('#article').on('click', '.edui-btn-fullscreen', function() {
		$('.header').toggle();
	})
})
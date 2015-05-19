$(function() {
	// 文章、文章标签、文章类型、友情链接、博客信息 的编辑和删除
	$.each(['article', 'articleTag', 'articleType', 'link', 'blogInfo'], function(i, x) {
		var
			data = {},
			$x = $('#' + x), // 编辑页
			xList = x + 'List'; // 列表页

		$x.find('#submit').click($x, function(e) { // 编辑
			e.data.find('.form-control').each(function() { // 遍历表单中的输入项,赋值给data
				var
					$this = $(this),
					value = $this.val();

				if ($this.data('obj')) value = jQuery.parseJSON(value); // 如果value为obj的字符串
				data[$this.attr('id')] = $this.val();
			})
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
					location.href = './' + xList;
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
				alert(data.msg);
				if (data.msg === '登陆成功') {
					location.href = './articleList';
				}
			}
		})
	})
})
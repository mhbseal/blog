$(function() {
	// 校验规则
	var rules = {
		// 必填
		isRequired: function(val) { return val !== '' },
		// 邮箱
		isEmail: function(val) { return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val) },
		// 网址
		isUrl: function(val) { return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val) }
	};
	// 文章、文章标签、文章类型、友情链接、博客信息 的编辑和删除
	$.each(['article', 'articleTag', 'articleType', 'link', 'blogInfo', 'admin', 'comment', 'user', 'singlePage'], function(i, x) {
		var
			introEditor, contentEditor,
			isValidateFail = false,
			data = {},
			$x = $('#' + x), // 编辑页
			$alert = $x.find('.js_alert'),
			xList = x + 'List'; // 列表页

		// 编辑器初始化
		if ($x.length) {
			if (x === 'article') { // 文章
				introEditor = UM.getEditor('introduction');
				contentEditor = UM.getEditor('content');
			}
			if (x === 'singlePage') { // 单页面
				contentEditor = UM.getEditor('content');
			}
		}

		$x.find('a').click(function(e) {
			$x.find('[name]').each(function() { // 遍历表单中的输入项,赋值给data
				var
					$this = $(this),
					value = $this.val(),
					key = $this.attr('name'),
					validate = $this.data('validate'),
					msg;

				// 检验输入项
				if (validate) {
					$.each(validate.rules, function(i, rule) {
						if (!rules[rule](value)) {
							msg = validate.msgs[i];
							return false;
						}
					})
					if (msg) {
						$alert.text(msg).show();
						isValidateFail = true;
						return false;
					} else {
						isValidateFail = false;
					}
				}

				if ($this.attr('type') === 'checkbox') { // checkbox有特殊逻辑
					if (!data[key]) data[key] = [];
					$this.is(':checked') && data[key].push(value)
				} else {
					data[key] = value;
				}
			})

			if (isValidateFail) {
				return false;
			} else {
				$alert.hide();
			}

			// 编辑器这里特殊处理
			if (x === 'article') {
				data.introduction = introEditor.getContent();
				data.content = contentEditor.getContent();
			}
			if (x === 'singlePage') {
				data.content = contentEditor.getContent();
			}

			$.ajax({
				type: $(e.target).data('id') ? 'put' : 'post',
				url: location.href,
				data: JSON.stringify(data),
				contentType: 'application/json',
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
		var
			$alert = $login.find('.js_alert'),
			isValidateFail = false,
			data = {};

		$login.find('[name]').each(function() { // 遍历表单中的输入项,赋值给data
			var
				$this = $(this),
				value = $this.val(),
				validate = $this.data('validate'),
				msg;

			// 检验输入项
			$.each(validate.rules, function(i, rule) {
				if (!rules[rule](value)) {
					msg = validate.msgs[i];
					return false;
				}
			})
			if (msg) {
				$alert.text(msg).show();
				isValidateFail = true;
				return false;
			} else {
				isValidateFail = false;
			}

			data[$this.attr('name')] = value;
		})

		if (isValidateFail) {
			return false;
		} else {
			$alert.hide();
		}

		$.ajax({
			type: 'get',
			url: $(e.target).data('href'),
			data: data,
			success: function(data) {
				if (data.msg === '已经登陆') {
					location.href = './articleList';
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
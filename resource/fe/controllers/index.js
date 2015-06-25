$(function () {
  // 校验规则
  var rules = {
    // 必填
    isRequired: function (val) {
      return val !== ''
    },
    // 邮箱
    isEmail: function (val) {
      return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val)
    }
  };
  // 搜索
  var $search = $('#search');
  $search.find('a').click(function () {
    location.href = '/search?kw=' + $search.find('input').val();
  })
  // 评论
  var $comment = $('#comment');
  // 点击回复
  $comment.find('.js_reply').click(function () {
    var name = $(this).parent().prev().find('strong').text();
    $comment.find('[name=content]').val('@' + name + ' - ');
  });
  // 提交评论
  $comment.find('.js_submit').click(function (e) {
    var
      $alert = $comment.find('.js_alert'),
      isValidateFail = false,
      data = {};

    $comment.find('[name]').each(function () { // 遍历表单中的输入项,赋值给data
      var
        $this = $(this),
        name = $this.attr('name'),
        value = $this.val(),
        validate = $this.data('validate'),
        msg;

      // 检验输入项
      $.each(validate.rules, function (i, rule) {
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

      if (name === 'content') {
        data['content'] = value.replace(/^(@.+\s)-\s*/, function (m, $1) {
          return '<strong>' + $1 + '</strong>'
        });
      } else {
        data[name] = value;
      }
    })

    if (isValidateFail) {
      return false;
    } else {
      $alert.hide();
    }

    // 关联文章
    data.article = $(e.target).data('article');
    $.ajax({
      type: 'post',
      url: '/comment',
      data: data,
      success: function (data) {
        if (data.status === 'success') {
          var
            comment = data.data,
            src = comment.user && comment.user.img || comment.admin && comment.admin.img,
            name = comment.user && comment.user.name || comment.admin && comment.admin.name;

          $comment.find('ul').prepend(
            '<li>\
              <div class="info">\
                <img src="' + src + '" />\
								<strong>' + name + '</strong><br />\
								<span>' + comment.time + '</span><br />\
							</div>\
							<div class="content">' + comment.content + '<br /><a href="#form" class="js_reply">回复</a></div>\
						</li>').show().prev().show();
        }

        alert(data.msg);
      }
    })
  })
  // 头部nav(响应式)
  var $nav = $('#nav');
  $nav.prev().click(function () {
    $nav.toggleClass('active');
  })
  // header效果
  var
    $win = $(window),
    timer;
  $win.scroll(function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if ($win.scrollTop() > 0) {
        $('.header').addClass('header_down');
      } else {
        $('.header').removeClass('header_down');
      }
    }, 200)
  })
})
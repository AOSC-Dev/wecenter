var document_title;

(function ($)
{
	$.fn.extend({
		highText: function (searchWords, htmlTag, tagClass)
	    {
	        return this.each(function ()
	        {
	            $(this).html(function high(replaced, search, htmlTag, tagClass)
	            {
	                var pattarn = search.replace(/\b(\w+)\b/g, "($1)").replace(/\s+/g, "|");

	                return replaced.replace(new RegExp(pattarn, "ig"), function (keyword)
	                {
	                    return $("<" + htmlTag + " class=" + tagClass + ">" + keyword + "</" + htmlTag + ">").outerHTML();
	                });
	            }($(this).text(), searchWords, htmlTag, tagClass));
	        });
	    },
	    outerHTML: function (s)
	    {
	        return (s) ? this.before(s).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
	    },
	    insertAtCaret : function (textFeildValue)
	    {
	    	var textObj = $(this).get(0);
	        if (document.all && textObj.createTextRange && textObj.caretPos)
	        {
	            var caretPos = textObj.caretPos;
	            caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ?
	                textFeildValue + '' : textFeildValue;
	        }
	        else if (textObj.setSelectionRange)
	        {
	            var rangeStart = textObj.selectionStart;
	            var rangeEnd = textObj.selectionEnd;
	            var tempStr1 = textObj.value.substring(0, rangeStart);
	            var tempStr2 = textObj.value.substring(rangeEnd);
	            textObj.value = tempStr1 + textFeildValue + tempStr2;
	            textObj.focus();
	            var len = textFeildValue.length;
	            textObj.setSelectionRange(rangeStart + len, rangeStart + len);
	            textObj.blur();
	        }
	        else
	        {
	            textObj.value += textFeildValue;
	        }
	    }
	});
})(jQuery);

$(window).on('hashchange', function() {
	if (window.location.hash.indexOf('#!') != -1)
	{
		if ($('a[name=' + window.location.hash.replace('#!', '') + ']').length)
		{
			$.scrollTo($('a[name=' + window.location.hash.replace('#!', '') + ']').offset()['top'] - 20, 600, {queue:true});
		}
	}
});


$(document).ready(function () {

	if (typeof (G_NOTIFICATION_INTERVAL) != 'undefined')
    {
        check_notifications();

        //setInterval('check_notifications()', G_NOTIFICATION_INTERVAL);
    }

	if (window.location.hash.indexOf('#!') != -1)
	{
		if ($('a[name=' + window.location.hash.replace('#!', '') + ']').length)
		{
			$.scrollTo($('a[name=' + window.location.hash.replace('#!', '') + ']').offset()['top'] - 20, 600, {queue:true});
		}
	}

	$('a[rel=lightbox]').fancybox(
    {
        openEffect: 'none',
        closeEffect: 'none',

        prevEffect: 'none',
        nextEffect: 'none',

        closeBtn: false,

        helpers:
        {
            buttons:
            {
                position: 'bottom'
            }
        },

        afterLoad: function ()
        {
            this.title = '第 ' + (this.index + 1) + ' 张, 共 ' + this.group.length + ' 张' + (this.title ? ' - ' + this.title : '');
        }
    });

	$('.aw-mod-publish .aw-publish-title textarea').autosize();

	init_comment_box('.aw-add-comment');
	init_article_comment_box('.aw-article-comment');

	$('.autosize').autosize();

	$('img#captcha').attr('src', G_BASE_URL + '/account/captcha/');

	$('#aw-top-nav-profile').click(function(){
		$('.aw-top-nav-popup').hide();
		$('.aw-top-nav-profile').show();
	});

	$('#aw-top-nav-notic').click(function()
	{
		$('.aw-top-nav-popup').hide();
		if (G_USER_ID)
		{
			$.get(G_BASE_URL + '/notifications/ajax/list/flag-0__limit-10', function (data) {
				if (data)
				{
					$('#notifications_list').html(data);
				}
				else
				{
					$('#notifications_list').html('<li><p align="center">暂无新通知</p></li>');
				}
				$('.aw-top-nav-notic').show();
			});
		}
	});

	/* 点击下拉菜单外得地方隐藏　*/
	$(document).click(function(e)
	{
		var target = $(e.target);
		if (target.closest('#aw-top-nav-profile, #aw-top-nav-notic').length == 0)
		{
			$('.aw-top-nav-popup, .dropdown-list').hide();
		}
	});

	/* 话题编辑删除按钮 */
	$(document).on('click', '.aw-question-detail-title .aw-topic-edit-box .aw-topic-box i', function()
	{
		var _this = $(this);
		$.post(G_BASE_URL + '/topic/ajax/remove_topic_relation/', {
			'type' : $(this).parents('.aw-topic-edit-box').attr('data-type'),
			'item_id' : $(this).parents('.aw-topic-edit-box').attr('data-id'),
			'topic_id' : $(this).parents('.aw-topic-name').attr('data-id')
		} , function(result)
		{
			if (result.errno == 1)
			{
				_this.parents('.aw-topic-name').detach();
			}else
			{
				alert(result.err);
			}
		}, 'json');
		return false;
	});

	dropdown_list('.aw-search-input','search');
	dropdown_list('.aw-invite-input','invite');
	add_topic_box('.aw-question-detail-title .aw-add-topic-box', 'question');
	add_topic_box('.aw-mod-publish .aw-add-topic-box','publish');

	//邀请回答按钮
	$('.aw-invite-replay').click(function()
	{
		if ($(this).parents('.aw-question-detail-title').find('.aw-invite-box').is(':visible'))
		{
			$(this).parents('.aw-question-detail-title').find('.aw-invite-box').hide();
		}else
		{
			$(this).parents('.aw-question-detail-title').find('.aw-invite-box').show();
		}
	});
	//邀请初始化
    $('.aw-question-detail-title .aw-invite-box ul li').hide();
    for (var i = 0; i < 3; i++)
    {
    	$('.aw-question-detail-title .aw-invite-box ul li').eq(i).show();
    }
    //长度小于3翻页隐藏
    if ($('.aw-question-detail-title .aw-invite-box ul li').length <=3 )
    {
    	$('.aw-question-detail-title .aw-invite-box .aw-mod-footer').hide();
    }
	//邀请上一页
    $('.aw-question-detail-title .aw-invite-box .prev').click(function()
    {
    	if (!$(this).hasClass('active'))
    	{
    		var attr = [],li_length = $('.aw-question-detail-title .aw-invite-box ul li').length;
	    	$.each($('.aw-question-detail-title .aw-invite-box ul li'), function (i, e)
	    	{
	    		if ($(this).is(':visible') == true)
	    		{
	    			attr.push($(this).index());
	    		}
	    	});
	    	$('.aw-question-detail-title .aw-invite-box ul li').hide();
	    	$.each(attr, function (i, e)
	    	{
				if (attr.join('') == '123' || attr.join('') == '234')
				{
					$('.aw-question-detail-title .aw-invite-box ul li').eq(0).show();
					$('.aw-question-detail-title .aw-invite-box ul li').eq(1).show();
					$('.aw-question-detail-title .aw-invite-box ul li').eq(2).show();
				}
				else
				{
	    			$('.aw-question-detail-title .aw-invite-box ul li').eq(e-3).show();
				}

	    		if (e-3 == 0)
	    		{
	    			$('.aw-question-detail-title .aw-invite-box .prev').addClass('active');
	    		}
	    	});
	    	$('.aw-question-detail-title .aw-invite-box .next').removeClass('active');
    	}
    });

    //邀请下一页
    $('.aw-question-detail-title .aw-invite-box .next').click(function()
    {
    	if (!$(this).hasClass('active'))
    	{
			var attr = [], li_length = $('.aw-question-detail-title .aw-invite-box ul li').length;
	    	$.each($('.aw-question-detail-title .aw-invite-box ul li'), function (i, e)
	    	{
	    		if ($(this).is(':visible') == true)
	    		{
	    			attr.push($(this).index());
	    		}
	    	});
	    	$.each(attr, function (i, e)
	    	{
	    		if (e+3 < li_length)
	    		{
	    			$('.aw-question-detail-title .aw-invite-box ul li').eq(e).hide();
	    			$('.aw-question-detail-title .aw-invite-box ul li').eq(e+3).show();
	    		}
	    		if (e+4 == $('.aw-question-detail-title .aw-invite-box ul li').length)
	    		{
	    			$('.aw-question-detail-title .aw-invite-box .next').addClass('active');
	    		}
	    	});
	    	$('.aw-question-detail-title .aw-invite-box .prev').removeClass('active');
    	}
    });



});

function check_notifications()
{
    if (G_USER_ID == 0)
    {
        return false;
    }

    $.get(G_BASE_URL + '/home/ajax/notifications/', function (result)
    {

        $('#inbox_unread').html(Number(result.rsm.inbox_num));

        last_unread_notification = G_UNREAD_NOTIFICATION;

        G_UNREAD_NOTIFICATION = Number(result.rsm.notifications_num);

        if (G_UNREAD_NOTIFICATION > 0)
        {
            if (G_UNREAD_NOTIFICATION != last_unread_notification)
            {
                reload_notification_list();

                $('#notifications_unread').html(G_UNREAD_NOTIFICATION);
            }
        }
        else
        {
            if ($('#header_notification_list').length > 0)
            {
                $("#header_notification_list").html('<p style="padding: 0" align="center">' + _t('没有未读通知') + '</p>');
            }

            if ($("#index_notification").length > 0)
            {
                $("#index_notification").fadeOut();
            }

            if ($('#tab_all_notifications').length > 0)
            {
                $('#tab_all_notifications').click();
            }
        }

        if (Number(result.rsm.notifications_num) > 0)
        {
            //document.title = '(' + (Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num)) + ') ' + document_title;

            $('#notifications_unread').show();
        }
        else
        {
            //document.title = document_title;

            $('#notifications_unread').hide();
        }

        if (Number(result.rsm.inbox_num) > 0)
        {
            $('#inbox_unread').show();
        }
        else
        {
            $('#inbox_unread').hide();
        }

        // if (((Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num))) > 0)
        // {
        //     document.title = '(' + (Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num)) + ') ' + document_title;
        // }
        // else
        // {
        //     document.title = document_title;
        // }
    }, 'json');
}

function reload_notification_list()
{
    if ($("#index_notification").length > 0)
    {
        $("#index_notification").fadeIn().find('[name=notification_unread_num]').html(G_UNREAD_NOTIFICATION);

        $('#index_notification ul#notification_list').html('<p align="center" style="padding: 15px 0"><img src="' + G_STATIC_URL + '/common/loading_b.gif"/></p>');

        $.get(G_BASE_URL + '/notifications/ajax/list/flag-0__page-0', function (response)
        {
            $('#index_notification ul#notification_list').html(response);

            notification_show(5);
        });
    }

    if ($("#header_notification_list").length > 0)
    {
        $("#header_notification_list").html('<p align="center">Loading...</p>');

        $.get(G_BASE_URL + '/notifications/ajax/list/flag-0__limit-5__template-header_list', function (response)
        {
            if (response.length)
            {
                $("#header_notification_list").html(response);

            }
            else
            {
                $("#header_notification_list").html('<p style="padding: 0" align="center">' + _t('没有未读通知') + '</p>');
            }
        });
    }
}

function notification_show(length)
{
    if ($('#index_notification').length > 0)
    {
        var n_count = 0;

        $('#index_notification ul#notification_list li').each(function (i, e)
        {
            if (i < length)
            {
                $(e).show();
            }
            else
            {
                $(e).hide();
            }

            n_count++;
        });

        if ($('#index_notification ul#notification_list li').length == 0)
        {
            $('#index_notification').fadeOut();
        }
    }
}

/* 弹窗 */
function alert_box(type , data)
{
	var template;

	switch (type)
	{
		case 'publish' :
			template = Hogan.compile(AW_MOBILE_TEMPLATE.publish).render({
	            'category_id': data.category_id,
	            'ask_user_id': data.ask_user_id
	        });
		break;

		case 'redirect' :
			template = Hogan.compile(AW_MOBILE_TEMPLATE.redirect).render({
				'data-id' : data
			});
		break;

		case 'message' :
			template = Hogan.compile(AW_MOBILE_TEMPLATE.message).render({
				'data-name' : data
			});
		break;

		case 'commentEdit':
	        var template = Hogan.compile(AW_MOBILE_TEMPLATE.editCommentBox).render(
	        {
	            'answer_id': data.answer_id,
	            'attach_access_key': data.attach_access_key
	        });
	        break;
	}
	if (template)
	{
		$('#aw-ajax-box').empty().append(template);

		switch (type)
		{
			case 'message' :
				dropdown_list('.aw-message-input','message');
			break;

			case 'redirect' :
				dropdown_list('.aw-redirect-input','redirect');
			break;

			case 'publish' :
				if (parseInt(data.category_enable) == 1)
	        	{
		        	$.get(G_BASE_URL + '/publish/ajax/fetch_question_category/', function (result)
		            {
		                add_dropdown_list('.alert-publish .aw-publish-dropdown', eval(result), data.category_id);

		                $('.alert-publish .aw-publish-dropdown li a').click(function ()
		                {
		                    $('#quick_publish_category_id').val($(this).attr('data-value'));
		                });
		            });

		            $('#quick_publish_topic_chooser').hide();
	        	}
	        	else
	        	{
		        	$('#quick_publish_category_chooser').hide();
	        	}

	            if ($('#aw-search-query').val() && $('#aw-search-query').val() != $('#aw-search-query').attr('placeholder'))
	            {
		            $('#quick_publish_question_content').val($('#aw-search-query').val());
	            }

	            add_topic_box('.alert-publish .aw-topic-edit-box .aw-add-topic-box', 'publish');

	            $('#quick_publish .aw-add-topic-box').click();

	            if (typeof(G_QUICK_PUBLISH_HUMAN_VALID) != 'undefined')
	            {
		            $('#quick_publish_captcha').show();
		            $('#qp_captcha').click();
	            }
			break;

			case 'commentEdit':
	            $.get(G_BASE_URL + '/question/ajax/fetch_answer_data/' + data.answer_id, function (result)
	            {
	                $('#editor_reply').html(result.answer_content.replace('&amp;', '&'));
	            }, 'json');

	            init_fileuploader('file_uploader_answer_edit', G_BASE_URL + '/publish/ajax/attach_upload/id-answer__attach_access_key-' + ATTACH_ACCESS_KEY);

	            if ($("#file_uploader_answer_edit ._ajax_upload-list").length) {
		            $.post(G_BASE_URL + '/publish/ajax/answer_attach_edit_list/', 'answer_id=' + data.answer_id, function (data) {
		                if (data['err']) {
		                    return false;
		                } else {
		                    $.each(data['rsm']['attachs'], function (i, v) {
		                        _ajax_uploader_append_file('#file_uploader_answer_edit ._ajax_upload-list', v);
		                    });
		                }
		            }, 'json');
		        }
	            break;
		}
	}

	$('.alert-' + type).modal('show');
}

/* 下拉列表 */
var aw_dropdown_list_interval, aw_dropdown_list_flag = 0;

function dropdown_list(element, type)
{
	var ul = $(element).next().find('ul');

	$(element).keydown(function()
	{
		if (aw_dropdown_list_flag == 0)
		{
			aw_dropdown_list_interval = setInterval(function()
			{
				if ($(element).val().length >= 2)
				{
					switch (type)
					{
						case 'search' :
							$.get(G_BASE_URL + '/search/ajax/search/?q=' + encodeURIComponent($(element).val()) + '&limit=5',function(result)
							{
								if (result.length > 0)
								{
									ul.html('');

									$.each(result, function(i, e)
									{
										switch(result[i].type)
										{
											case 'questions' :
												ul.append('<li><a href="' + decodeURIComponent(result[i].url) + '">' + result[i].name + '<span class="aw-text-color-999">' + result[i].detail.answer_count + ' 个回答</span></a></li>');
												break;

											case 'articles' :
												ul.append('<li><a href="' + decodeURIComponent(result[i].url) + '">' + result[i].name + '<span class="aw-text-color-999">' + result[i].detail.comments + ' 个评论</span></a></li>');
												break;

											case 'topics' :
												ul.append('<li><a class="aw-topic-name" href="' + decodeURIComponent(result[i].url) + '">' + result[i].name  + '</a><span class="aw-text-color-999">' + result[i].detail.discuss_count + ' 个问题</span></li>');
												break;

											case 'users' :
												ul.append('<li><a href="' + decodeURIComponent(result[i].url) + '"><img src="' + result[i].detail.avatar_file + '"><span>' + result[i].name + '</span></a></li>');
												break;
										}
									});

									$(element).next().show();
								}else
								{
									$(element).next().hide();
								}
							},'json');
						break;

						case 'message' :
							$.get(G_BASE_URL + '/search/ajax/search/type=users&q=' + encodeURIComponent($(element).val()) + '&limit=10',function(result)
							{
								if (result.length > 0)
								{
									ul.html('');
									$.each(result ,function(i, e)
									{
										ul.append('<li><a><img src="' + result[i].detail.avatar_file + '"><span>' + result[i].name + '</span></a></li>')
									});
									$('.alert-message .dropdown-list ul li a').click(function()
									{
										$(element).val($(this).text());
										$(element).next().hide();
									});

									$(element).next().show();
								}else
								{
									$(element).next().hide();
								}
							},'json');
						break;

						case 'invite' :
							$.get(G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent($(element).val()) + '&limit=10',function(result)
							{
								if (result.length > 0)
								{
									ul.html('');

									$.each(result ,function(i, e)
									{
										ul.append('<li><a data-id="' + result[i].uid + '" data-value="' + result[i].name + '"><img src="' + result[i].detail.avatar_file + '"><span>' + result[i].name + '</span></a></li>')
									});

									$('.aw-invite-box .dropdown-list ul li a').click(function()
									{
										invite_user($(this),$(this).parents('li').find('img').attr('src'));
									});

									$(element).next().show();
								}else
								{
									$(element).next().hide();
								}
							},'json');
						break;

						case 'redirect' :
							$.get(G_BASE_URL + '/search/ajax/search/?q=' + encodeURIComponent($(element).val()) + '&type=questions&limit-30',function(result)
							{
								if (result.length > 0)
								{
									ul.html('');

									$.each(result ,function(i, e)
									{
										ul.append('<li><a onclick="ajax_request(' + "'" + G_BASE_URL + "/question/ajax/redirect/', 'item_id=" + $(element).attr('data-id') + "&target_id=" + result[i].search_id + "'" +')">' + result[i].name +'</a></li>')
									});

									$(element).next().show();
								}else
								{
									$(element).next().hide();
								}
							},'json');
						break;

						case 'topic' :
							$.get(G_BASE_URL + '/search/ajax/search/?type=topics&q=' + encodeURIComponent($(element).val()) + '&limit=10',function(result)
							{
								if (result.length > 0)
								{
									ul.html('');

									$.each(result ,function(i, e)
									{
										ul.append('<li><a>' + result[i].name +'</a></li>')
									});

									$('.alert-publish .aw-topic-edit-box .dropdown-list ul li, .aw-mod-publish .aw-topic-edit-box .dropdown-list ul li').click(function()
									{
										$(element).parents('.aw-topic-edit-box').find('.aw-topic-box').prepend('<span class="aw-topic-name"><a>' + $(this).text() + '</a><input type="hidden" name="topics[]" value="' + $(this).text() + '"><a href="#"><i onclick="$(this).parents(\'.aw-topic-name\').detach();">X</i></a></span>');
										$(element).val('');
										$('.alert-publish .aw-topic-edit-box .dropdown-list, .aw-mod-publish .aw-topic-edit-box .dropdown-list').hide();
									});

									$('.aw-question-detail-title .aw-topic-edit-box .dropdown-list ul li').click(function()
									{
										$(this).parents('.aw-topic-box-selector').find('.aw-topic-input').val($(this).text());
										$(this).parents('.aw-topic-box-selector').find('.btn-success').click();
									});

									$(element).next().show();
								}else
								{
									$(element).next().hide();
								}
							},'json');

						break;
					}
				}
				else
				{
					$(element).next().hide();
				}
			},1000);

			switch (type)
			{
				case 'message' :
					$('.alert-message .dropdown-list ul li').click(function()
					{
						$(element).val($(this).find('span').html());
						$(element).next().hide();
					});
				break;
			}
			aw_dropdown_list_flag = 1;
			return aw_dropdown_list_interval;
		}
	});

	$(element).blur(function()
	{
		clearInterval(aw_dropdown_list_interval);

		aw_dropdown_list_flag = 0;
	});
}

/* 话题编辑 */
function add_topic_box(element, type)
{
	$(element).click(function()
	{
		var data_id = $(this).parents('.aw-topic-edit-box').attr('data-id'),
			data_type;
		if (type)
		{
			data_type = type;
		}
		else
		{
			data_type = $(this).parents('.aw-topic-edit-box').attr('data-type');
		}
		$(element).hide();
		$(element).parents('.aw-topic-edit-box').append(AW_MOBILE_TEMPLATE.topic_edit_box);
		$.each($(element).parents('.aw-topic-edit-box').find('.aw-topic-name'), function(i, e)
		{
			if (!$(e).has('i')[0])
			{
				$(e).append('<a href="#"><i>X</i></a>');
			}
		});
		dropdown_list('.aw-topic-box-selector .aw-topic-input','topic');
		/* 话题编辑添加按钮 */
		$('.aw-topic-box-selector .add').click(function()
		{
			switch (data_type)
			{
				case 'publish' :
					if ($(this).parents('.aw-topic-box-selector').find('.aw-topic-input').val() != '')
					{
						$(this).parents('.aw-topic-edit-box').find('.aw-topic-box').prepend('<span class="aw-topic-name"><a>' + $(this).parents('.aw-topic-box-selector').find('.aw-topic-input').val() + '</a><input type="hidden" name="topics[]" value="' + $(this).parents('.aw-topic-box-selector').find('.aw-topic-input').val() + '"><a><i onclick="$(this).parents(\'.aw-topic-name\').detach();">X</i></a></span>');
						$(this).parents('.aw-topic-edit-box').find('.aw-topic-input').val('');
						$(this).parents('.aw-topic-edit-box').find('.dropdown-list').hide();
					}
				break;
				case 'question' :
					var _this = $(this);
					$.post(G_BASE_URL + '/topic/ajax/save_topic_relation/', 'type=question&item_id=' + data_id + '&topic_title=' + encodeURIComponent($(this).parents('.aw-topic-box-selector').find('.aw-topic-input').val()), function(result)
					{
						if (result.errno == 1)
						{
							_this.parents('.aw-topic-edit-box').find('.aw-topic-box').prepend('<span class="aw-topic-name" data-id="'+ result.rsm.topic_id +'"><a>' + _this.parents('.aw-topic-box-selector').find('.aw-topic-input').val() + '</a><a><i>X</i></a></span>');
							_this.parents('.aw-topic-edit-box').find('.aw-topic-input').val('');
							_this.parents('.aw-topic-edit-box').find('.dropdown-list').hide();
						}else
						{
							alert(result.err);
							_this.parents('.aw-topic-edit-box').find('.dropdown-list').hide();
						}
					}, 'json');
				break;
				case 'article' :
					var _this = $(this);
					$.post(G_BASE_URL + '/topic/ajax/save_topic_relation/', 'type=article&item_id=' + data_id + '&topic_title=' + encodeURIComponent($(this).parents('.aw-topic-box-selector').find('.aw-topic-input').val()), function(result)
					{
						if (result.errno == 1)
						{
							_this.parents('.aw-topic-edit-box').find('.aw-topic-box').prepend('<span class="aw-topic-name" data-id="'+ result.rsm.topic_id +'"><a>' + _this.parents('.aw-topic-box-selector').find('.aw-topic-input').val() + '</a><a><i>X</i></a></span>');
							_this.parents('.aw-topic-edit-box').find('.aw-topic-input').val('');
							_this.parents('.aw-topic-edit-box').find('.dropdown-list').hide();
						}else
						{
							alert(result.err);
							_this.parents('.aw-topic-edit-box').find('.dropdown-list').hide();
						}
					}, 'json');
				break;
			}
		});

		$('.aw-question-detail-title .aw-topic-edit-box .dropdown-list ul li').click(function()
		{
			var _this = $(this);

			switch (data_type)
			{
				case 'question' :
					$.post(G_BASE_URL + '/question/ajax/save_topic/question_id-' + $(this).parents('.aw-topic-edit-box').attr('data-id'), 'topic_title=' + encodeURIComponent($(this).text()), function(result)
					{
						if (result.errno == 1)
						{
							$(element).parents('.aw-topic-edit-box').find('.aw-topic-box').prepend('<span class="aw-topic-name" data-id="' + result.rsm.topic_id + '"><a>' + _this.text() + '</a><a href="#"><i>X</i></a></span>');
							$(element).val('');
							$(element).next().hide();
						}else
						{
							alert(result.err);
						}
					}, 'json');
				break;

				case 'article' :
					$.post(G_BASE_URL + '/question/ajax/save_topic/article_id-' + $(this).parents('.aw-topic-edit-box').attr('data-id'), 'topic_title=' + encodeURIComponent($(this).text()), function(result)
					{
						if (result.errno == 1)
						{
							$(element).parents('.aw-topic-edit-box').find('.aw-topic-box').prepend('<span class="aw-topic-name" data-id="' + result.rsm.topic_id + '"><a>' + _this.text() + '</a><a href="#"><i>X</i></a></span>');
							$(element).val('');
							$(element).next().hide();
						}else
						{
							alert(result.err);
						}
					}, 'json');
			}


		});
		/* 话题编辑取消按钮 */
		$('.aw-topic-box-selector .cancel').click(function()
		{
			$(this).parents('.aw-topic-edit-box').find('.aw-add-topic-box').show();
			$.each($(this).parents('.aw-topic-edit-box').find('.aw-topic-name'), function(i, e)
			{
				if ($(e).has('i')[0])
				{
					$(e).find('i').detach();
				}
			});
			$(this).parents('.aw-topic-box-selector').detach();
		});
	});
}

/*邀请回答*/
function invite_user(obj, img)
{
	var _this = obj;

	$.post(G_BASE_URL + '/question/ajax/save_invite/',
    {
        'question_id': QUESTION_ID,
        'uid': _this.attr('data-id')
    },function (result)
    {
    	if (result.errno == -1)
    	{
    		alert(result.err);
    	}else
    	{
    		// location.reload();
    		 if ($(_this).parents('.aw-invite-box').find('.invite-list a').length == 0)
            {
                $(_this).parents('.aw-invite-box').find('.invite-list').show();
            }
            $(_this).parents('.aw-invite-box').find('.invite-list').append(' <a class="aw-text-color-999 invite-list-user" data-toggle="tooltip" data-placement="right" data-original-title="'+ _this.attr('data-value') +'"><img src='+ img +' /></a>');
            _this.removeClass('btn-primary').attr('onclick','disinvite_user($(this))').text('取消邀请');
            _this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text(parseInt(_this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text()) + 1);
    	}
    }, 'json');

}

/*取消邀请*/
function disinvite_user(obj)
{
	var _this = obj;

    $.get(G_BASE_URL + '/question/ajax/cancel_question_invite/question_id-' + QUESTION_ID + "__recipients_uid-" + _this.attr('data-id'), function (result)
	{
		if (result.errno != -1)
        {
            $.each($('.aw-question-detail-title .invite-list a'), function (i, e)
            {
                if ($(this).attr('data-original-title') == _this.parents('.main').find('.aw-user-name').text())
                {
                    $(this).detach();
                }
            });
            _this.addClass('btn-primary').attr('onclick','invite_user($(this),$(this).parents(\'li\').find(\'img\').attr(\'src\'))').text('邀请');
            _this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text(parseInt(_this.parents('.aw-question-detail-title').find('.aw-invite-replay .badge').text()) - 1);
            if ($(_this).parents('.aw-invite-box').find('.invite-list').children().length == 0)
            {
                $(_this).parents('.aw-invite-box').find('.invite-list').hide();
            }
        }
	});
}

/*动态插入下拉菜单模板*/
function add_dropdown_list(selecter, data, selected)
{
    $(selecter).append(Hogan.compile(AW_MOBILE_TEMPLATE.dropdownList).render(
    {
        'items': data
    }));

    $(selecter + ' .dropdown-menu li a').click(function ()
    {
        $('.aw-publish-dropdown span').html($(this).text());
    });

    if (selected)
    {
        $(selecter + " .dropdown-menu li a[data-value='" + selected + "']").click();
    }
}

/*修复focus时光标位置*/
function _fix_textarea_focus_cursor_position(elTextarea)
{
    if (/MSIE/.test(navigator.userAgent) || /Opera/.test(navigator.userAgent))
    {
        var rng = elTextarea.createTextRange();
        rng.text = elTextarea.value;
        rng.collapse(false);
    }
    else if (/WebKit/.test(navigator.userAgent))
    {
        elTextarea.select();
        window.getSelection().collapseToEnd();
    }
}

function _quick_publish_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        $('#quick_publish_error em').html(result.err);
        $('#quick_publish_error').fadeIn();
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            window.location.reload();
        }
    }
}

function init_fileuploader(element_id, action_url)
{
    if (!document.getElementById(element_id))
    {
        return false;
    }

    // if (G_UPLOAD_ENABLE == 'Y')
    // {
    // 	$('.aw-upload-tips').show();
    // }

    return new _ajax_uploader.FileUploader(
    {
        element: document.getElementById(element_id),
        action: action_url,
        debug: false
    });
}

function insert_attach(element, attach_id, attach_tag)
{
    $(element).parents('form').find('.textarea_content').insertAtCaret("\n[" + attach_tag + "]" + attach_id + "[/" + attach_tag + "]\n");
}

function read_notification(notification_id, el, reload)
{
    if (notification_id)
    {
        el.remove();

        notification_show(5);

        if ($("#announce_num").length > 0)
        {
            $("#announce_num").html(String(G_UNREAD_NOTIFICATION - 1));
        }

        if ($("#notifications_num").length > 0)
        {
            $("#notifications_num").html(String(G_UNREAD_NOTIFICATION - 1));
        }

        var url = G_BASE_URL + '/notifications/ajax/read_notification/notification_id-' + notification_id;
    }
    else
    {
        if ($("#index_notification").length > 0)
        {
            $("#index_notification").fadeOut();
        }

        var url = G_BASE_URL + '/notifications/ajax/read_notification/';
    }

    $.get(url, function (respose)
    {
        check_notifications();

        if (reload)
        {
            window.location.reload();
        }
    });
}

/* 文章赞同反对 */
function article_vote(element, article_id, rating)
{
	$.loading('show');

	if ($(element).hasClass('active'))
	{
		rating = 0;
	}

	$.post(G_BASE_URL + '/article/ajax/article_vote/', 'type=article&item_id=' + article_id + '&rating=' + rating, function (result) {
		$.loading('hide');

		if (result.errno != 1)
	    {
	        $.alert(result.err);
	    }
	    else
	    {
			if (rating == 0)
			{

				$(element).removeClass('active');
                $(element).find('b').html(parseInt($(element).find('b').html()) - 1);
			}
            else if (rating == -1)
            {
                if ($(element).parents('.aw-article-vote').find('.agree').hasClass('active'))
                {
                    $(element).parents('.aw-article-vote').find('b').html(parseInt($(element).parents('.aw-article-vote').find('b').html()) - 1);
                    $(element).parents('.aw-article-vote').find('a').removeClass('active');
                }
                $(element).addClass('active');
            }
			else
			{
				$(element).parents('.aw-article-vote').find('a').removeClass('active');
				$(element).addClass('active');
                $(element).find('b').html(parseInt($(element).find('b').html()) + 1);
			}
	    }
	}, 'json');
}


var aw_loading_timer;
var aw_loading_bg_count = 12;

$.loading = function (s) {
	if ($('#aw-loading').length == 0)
    {
        $('#aw-ajax-box').append('<div id="aw-loading" class="hide"><div id="aw-loading-box"></div></div>');
    }

	if (s == 'show')
	{
		if ($('#aw-loading').css('display') == 'block')
	    {
		    return false;
	    }

		$('#aw-loading').fadeIn();

		aw_loading_timer = setInterval(function () {
			aw_loading_bg_count = aw_loading_bg_count - 1;

			$('#aw-loading-box').css('background-position', '0px ' + aw_loading_bg_count * 40 + 'px');

			if (aw_loading_bg_count == 1)
			{
				aw_loading_bg_count = 12;
			}
		}, 100);
	}
	else
	{
		$('#aw-loading').fadeOut();

		clearInterval(aw_loading_timer);
	}
};

function _t(string, replace)
{
	if (typeof(aws_lang) == 'undefined')
	{
		if (replace)
		{
			string = string.replace('%s', replace);
		}

		return string;
	}

	if (aws_lang[string])
	{
		string = aws_lang[string];

		if (replace)
		{
			string = string.replace('%s', replace);
		}

		return string;
	}
}

var _list_view_pages = new Array();

function load_list_view(url, list_view, ul_button, start_page, callback_func)
{
	if (!ul_button.attr('id'))
	{
		return false;
	}

	if (!start_page)
	{
		start_page = 0
	}

	_list_view_pages[ul_button.attr('id')] = start_page;

	ul_button.unbind('click');

	ul_button.bind('click', function () {
		var _this = this;

		$.loading('show');

		$(_this).addClass('disabled');

		$.get(url + '__page-' + _list_view_pages[ul_button.attr('id')], function (response)
		{
			if ($.trim(response) != '')
			{
				if (_list_view_pages[ul_button.attr('id')] == start_page)
				{
					list_view.html(response);
				}
				else
				{
					list_view.append(response);
				}

				_list_view_pages[ul_button.attr('id')]++;

				$(_this).removeClass('disabled');
			}
			else
			{
				if ($.trim(list_view.html()) == '')
				{
					list_view.append('<p align="center">没有相关内容</p>');
				}

				$(_this).unbind('click').bind('click', function () { return false; });
			}

			$.loading('hide');

			if (callback_func != null)
			{
				callback_func();
			}
		});

		return false;
	});

	ul_button.click();
}

function ajax_post(formEl, processer)	// 表单对象，用 jQuery 获取，回调函数名
{
	if (typeof(processer) != 'function')
	{
		processer = _ajax_post_processer;

		$.loading('show');
	}

	var custom_data = {
		_post_type:'ajax',
		_is_mobile:'true'
	};

	formEl.ajaxSubmit({
		dataType: 'json',
		data: custom_data,
		success: processer,
		error:	function (error) { if ($.trim(error.responseText) != '') { $.loading('hide'); alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText); } }
	});
}

function _ajax_post_processer(result)
{
	$.loading('hide');

	if (typeof(result.errno) == 'undefined')
	{
		alert(result);
	}
	else if (result.errno != 1)
	{
		alert(result.err);

        if ($('#captcha'))
        {
            reload_captcha();
        }
	}
	else
	{
		if (result.rsm && result.rsm.url)
		{
			window.location = decodeURIComponent(result.rsm.url);
		}
		else
		{
			window.location.reload();
		}
	}
}

function reload_captcha() {
    $("#captcha").attr("src", G_BASE_URL + '/account/captcha/' + Math.floor(Math.random() * 10000));
    $("input[name='seccode_verify']").val("");
};

function ajax_request(url, params)
{
	$.loading('show');

	if (params)
	{
		$.post(url, params, function (result) {
			$.loading('hide');

			if (result.err)
			{
				alert(result.err);
			}
			else if (result.rsm && result.rsm.url)
			{
				window.location = decodeURIComponent(result.rsm.url);
			}
			else
			{
				window.location.reload();
			}
		}, 'json').error(function (error) { if ($.trim(error.responseText) != '') {  $.loading('hide'); alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText); } });
	}
	else
	{
		$.get(url, function (result) {
			$.loading('hide');

			if (result.err)
			{
				alert(result.err);
			}
			else if (result.rsm && result.rsm.url)
			{
				window.location = decodeURIComponent(result.rsm.url);
			}
			else
			{
				window.location.reload();
			}
		}, 'json').error(function (error) { if ($.trim(error.responseText) != '') { $.loading('hide'); alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText); } });
	}

	return false;
}

function focus_question(el, text_el, question_id)
{
	if (el.hasClass('aw-active'))
	{
		text_el.html(_t('关注'));

		el.removeClass('aw-active');
	}
	else
	{
		text_el.html(_t('取消关注'));

		el.addClass('aw-active');
	}

	$.loading('show');

	$.get(G_BASE_URL + '/question/ajax/focus/question_id-' + question_id, function (data)
	{
		$.loading('hide');

		if (data.errno != 1)
		{
			if (data.err)
			{
				alert(data.err);
			}

			if (data.rsm.url)
			{
				window.location = decodeURIComponent(data.rsm.url);
			}
		}
	}, 'json');
}

function focus_topic(el, text_el, topic_id)
{
	if (el.hasClass('aw-active'))
	{
		text_el.html(_t('关注'));
		el.removeClass('aw-active');
	}
	else
	{
		text_el.html(_t('取消关注'));
		el.addClass('aw-active');
	}

	$.loading('show');

	$.get(G_BASE_URL + '/topic/ajax/focus_topic/topic_id-' + topic_id, function (data)
	{
		$.loading('hide');

		if (data.errno != 1)
		{
			if (data.err)
			{
				alert(data.err);
			}

			if (data.rsm.url)
			{
				window.location = decodeURIComponent(data.rsm.url);
			}
		}
	}, 'json');
}

function follow_people(el, uid)
{
	if (!el.hasClass('aw-active'))
    {
        el.html(_t('取消关注'));
        el.addClass('aw-active');
    }
    else
    {
        el.html(_t('关注'));
        el.removeClass('aw-active');
    }

	$.loading('show');

	$.get(G_BASE_URL + '/follow/ajax/follow_people/uid-' + uid, function (data)
	{
		$.loading('hide');

		if (data.errno != 1)
		{
			if (data.err)
			{
				alert(data.err);
			}

			if (data.rsm.url)
			{
				window.location = decodeURIComponent(data.rsm.url);
			}
		}
	}, 'json');
}

function answer_user_rate(answer_id, type, element)
{
	$.loading('show');

	$.post(G_BASE_URL + '/question/ajax/question_answer_rate/', 'type=' + type + '&answer_id=' + answer_id, function (result) {

		$.loading('hide');

		if (result.errno != 1)
		{
			alert(result.err);
		}
		else if (result.errno == 1)
		{
			switch (type)
			{
				case 'thanks':
					if (result.rsm.action == 'add')
					{
						$(element).find('span.ui-btn-text').html(_t('已感谢'));
						$(element).removeAttr('onclick');
					}
					else
					{
						$(element).html(_t('感谢'));
					}
				break;

				case 'uninterested':
					if (result.rsm.action == 'add')
					{
						$(element).find('span.ui-btn-text').html(_t('撤消没有帮助'));
					}
					else
					{
						$(element).find('span.ui-btn-text').html(_t('没有帮助'));
					}
				break;
			}
		}
	}, 'json');
}

function _ajax_post_confirm_processer(result)
{
	if (typeof(result.errno) == 'undefined')
	{
		alert(result);
	}
	else if (result.errno != 1)
	{
		if (!confirm(result.err))
		{
			return false;
		}
	}

	if (result.errno == 1 && result.err)
	{
		alert(result.err);
	}

	if (result.rsm && result.rsm.url)
	{
		window.location = decodeURIComponent(result.rsm.url);
	}
	else
	{
		window.location.reload();
	}
}

function answer_vote(element, answer_id, val)
{
	var data_theme = element.attr('data-theme');

	$('.ui-dialog').dialog('close');

	$.loading('show');

	$.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=' + val, function (result) {
		$.loading('hide');

		if (data_theme == 'd')
		{
			$('#answer_vote_button').removeClass('ui-btn-up-d').removeClass('ui-btn-hover-d');

			$('#answer_vote_button').addClass('ui-btn-up-b');
			$('#answer_vote_button').attr('data-theme', 'b');

			if (parseInt(val) > 0)
			{
				$('#answer_vote_button').find('span.ui-btn-text').html((parseInt($('#answer_vote_button').find('span.ui-btn-text').text()) + parseInt(val)));
			}
		}
		else
		{
			$('#answer_vote_button').removeClass('ui-btn-up-b').removeClass('ui-btn-hover-b');

			$('#answer_vote_button').addClass('ui-btn-up-d');
			$('#answer_vote_button').attr('data-theme', 'd');

			if (parseInt(val) > 0)
			{
				$('#answer_vote_button').find('span.ui-btn-text').html((parseInt($('#answer_vote_button').find('span.ui-btn-text').text()) - parseInt(val)));
			}
		}
	});
}

function init_comment_box(selecter)
{
    $(document).on('click', selecter, function ()
    {
        if (!$(this).attr('data-type') || !$(this).attr('data-id'))
        {
            return true;
        }

        var comment_box_id = '#aw-comment-box-' + $(this).attr('data-type') + '-' + 　$(this).attr('data-id');

        if ($(comment_box_id).length > 0)
        {
            if ($(comment_box_id).css('display') == 'none')
            {
                $(comment_box_id).fadeIn();
            }
            else
            {
                $(comment_box_id).fadeOut();
            }
        }
        else
        {
            // 动态插入commentBox
            switch ($(this).attr('data-type'))
            {
	            case 'question':
	                var comment_form_action = G_BASE_URL + '/question/ajax/save_question_comment/question_id-' + $(this).attr('data-id');
	                var comment_data_url = G_BASE_URL + '/question/ajax/get_question_comments/question_id-' + $(this).attr('data-id');
	                break;

	            case 'answer':
	                var comment_form_action = G_BASE_URL + '/question/ajax/save_answer_comment/answer_id-' + $(this).attr('data-id');
	                var comment_data_url = G_BASE_URL + '/question/ajax/get_answer_comments/answer_id-' + $(this).attr('data-id');
	                break;
            }

            if (G_USER_ID && $(this).attr('data-close') != 'true')
            {
                $(this).parents('.aw-mod-footer').append(Hogan.compile(AW_MOBILE_TEMPLATE.commentBox).render(
                {
                    'comment_form_id': comment_box_id.replace('#', ''),
                    'comment_form_action': comment_form_action
                }));

                $(comment_box_id).find('.close-comment-box').click(function ()
                {
                    $(comment_box_id).fadeOut();
                });

                $(comment_box_id).find('.aw-comment-txt').autosize();
            }
            else
            {
                $(this).parents('.aw-mod-footer').append(Hogan.compile(AW_MOBILE_TEMPLATE.commentBoxClose).render(
                {
                    'comment_form_id': comment_box_id.replace('#', ''),
                    'comment_form_action': comment_form_action
                }));
            }

            //判断是否有评论数据
            $.get(comment_data_url, function (result)
            {
                if ($.trim(result) == '')
                {
                    result = '<p align="center">' + _t('暂无评论') + '</p>';
                }

                $(comment_box_id).find('.aw-comment-list').html(result);
            });

            //var left = $(this).width()/2 + $(this).prev().width();
            /*给三角形定位*/
            //$(comment_box_id).find('.i-comment-triangle').css('left', $(this).width() / 2 + $(this).prev().width() + 15);
        }
    });
}

function init_article_comment_box(selecter)
{
	$(document).on('click', selecter, function ()
    {
        if ($(this).parents('.aw-item').find('.aw-comment-box').length)
        {
            if ($(this).parents('.aw-item').find('.aw-comment-box').css('display') == 'block')
            {
               $(this).parents('.aw-item').find('.aw-comment-box').fadeOut();
            }
            else
            {
                $(this).parents('.aw-item').find('.aw-comment-box').fadeIn();
            }
        }
        else
        {
            $(this).parents('.aw-item').append(Hogan.compile(AW_MOBILE_TEMPLATE.articleCommentBox).render(
            {
                'at_uid' : $(this).attr('data-id'),
                'article_id' : $('.aw-anwser-box input[name="article_id"]').val()
            }));
            $(this).parents('.aw-item').find('.close-comment-box').click(function ()
            {
                $(this).parents('.aw-item').find('.aw-comment-box').fadeOut();
            });
            $(this).parents('.aw-item').find('.aw-comment-txt').autosize();
        }
    });
}

function save_comment(save_button_el)
{
    $(save_button_el).attr('_onclick', $(save_button_el).attr('onclick')).addClass('disabled').removeAttr('onclick').addClass('_save_comment');

    ajax_post($(save_button_el).parents('form'), _comments_form_processer);
}

function _comments_form_processer(result)
{
    $.each($('a._save_comment.disabled'), function (i, e)
    {
        $(e).attr('onclick', $(this).attr('_onclick')).removeAttr('_onclick').removeClass('disabled').removeClass('_save_comment');
    });

    if (result.errno != 1)
    {
        alert(result.err);
    }
    else
    {
        reload_comments_list(result.rsm.item_id, result.rsm.item_id, result.rsm.type_name);

        $('#aw-comment-box-' + result.rsm.type_name + '-' + result.rsm.item_id + ' form input').val('');
        $('#aw-comment-box-' + result.rsm.type_name + '-' + result.rsm.item_id + ' form textarea').val('');
    }
}

function remove_comment(el, type, comment_id)
{
	$.get(G_BASE_URL + '/question/ajax/remove_comment/type-' + type + '__comment_id-' + comment_id);

	$(el).parents('.aw-comment-box li').fadeOut();
}

function reload_comments_list(item_id, element_id, type_name)
{
    $('#aw-comment-box-' + type_name + '-' + element_id + ' .aw-comment-list').html('<p align="center" class="aw-padding10"><i class="aw-loading"></i></p>');

    $.get(G_BASE_URL + '/question/ajax/get_' + type_name + '_comments/' + type_name + '_id-' + item_id, function (data)
    {
        $('#aw-comment-box-' + type_name + '-' + element_id + ' .aw-comment-list').html(data);
    });
}

function question_thanks(question_id, element)
{
    $.post(G_BASE_URL + '/question/ajax/question_thanks/', 'question_id=' + question_id, function (result)
    {
        if (result.errno != 1)
        {
            alert(result.err);
        }
        else if (result.rsm.action == 'add')
        {
            $(element).html($(element).html().replace(_t('感谢'), _t('已感谢')));
            $(element).removeAttr('onclick');
        }
        else
        {
            $(element).html($(element).html().replace(_t('已感谢'), _t('感谢')));
        }
    }, 'json');
}

//赞成投票
function agreeVote(element, answer_id)
{
	$.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=1', function (result) {});

    //判断是否投票过
    if ($(element).find('i').hasClass('active'))
    {
    	return false;
    }
    else
    {
    	$(element).find('i').addClass('active');

    	$(element).find('em').html(parseInt($(element).find('em').html()) + 1);
    }
}

//反对投票
function disagreeVote(element, answer_id)
{
    $.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=-1', function (result) {});

    //判断是否投票过
    if ($(element).find('.aw-icon').hasClass('active'))
    {
    	$(element).parents('.aw-mod-footer').find('a.answer_vote .aw-icon').removeClass('active');

        $(element).find('.aw-icon').removeClass('active');
    }
    else
    {
    	if ($(element).parents('.aw-mod-footer').find('.agree').hasClass('active'))
    	{
    		if (parseInt($(element).parents('.aw-mod-footer').find('.agree').next().html()) > 0)
	    	{
	    		$(element).parents('.aw-mod-footer').find('.agree').next().html(parseInt($(element).parents('.aw-mod-footer').find('.agree').next().html()) - 1);
	    	}
    	}

    	$(element).parents('.aw-mod-footer').find('a.answer_vote .aw-icon').removeClass('active');

    	$(element).find('.aw-icon').addClass('active');


       	//$(element).parents('.aw-mod-footer').find('a.answer_vote em').html(parseInt($(element).parents('.aw-mod-footer').find('a.answer_vote em').html()) - 1);
    }
}

function answer_user_rate(answer_id, type, element)
{
    $.post(G_BASE_URL + '/question/ajax/question_answer_rate/', 'type=' + type + '&answer_id=' + answer_id, function (result)
    {
        if (result.errno != 1)
        {
            alert(result.err);
        }
        else if (result.errno == 1)
        {
            switch (type)
            {
            case 'thanks':
                if (result.rsm.action == 'add')
                {
                    $(element).html($(element).html().replace(_t('感谢'), _t('已感谢')));
                    $(element).removeAttr('onclick');
                }
                else
                {
                    $(element).html($(element).html().replace(_t('已感谢'), _t('感谢')));
                }
                break;

            case 'uninterested':
                if (result.rsm.action == 'add')
                {
                    $(element).html(_t('撤消没有帮助'));
                }
                else
                {
                    $(element).html(_t('没有帮助'));
                }
                break;
            }
        }
    }, 'json');
}

function comment_vote(element, comment_id, rating)
{
	$.loading('show');

	if ($(element).hasClass('active'))
	{
		rating = 0;
	}

	$.post(G_BASE_URL + '/article/ajax/article_vote/', 'type=comment&item_id=' + comment_id + '&rating=' + rating, function (result) {
		$.loading('hide');

		if (result.errno != 1)
	    {
	        alert(result.err);
	    }
	    else
	    {
			if (rating == 0)
			{
				$(element).removeClass('active');
				$(element).html($(element).html().replace(_t('我已赞'), _t('赞')));
			}
			else
			{
				$(element).addClass('active');
				$(element).html($(element).html().replace(_t('赞'), _t('我已赞')));
			}
	    }
	}, 'json');
}

function _ajax_post_alert_processer(result)
{
    if (typeof (result.errno) == 'undefined')
    {
        alert(result);
    }
    else if (result.errno != 1)
    {
        alert(result.err);
    }
    else
    {
        if (result.rsm && result.rsm.url)
        {
            window.location = decodeURIComponent(result.rsm.url);
        }
        else
        {
            window.location.reload();
        }
    }
}

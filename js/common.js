var rooturl = 'http://120.79.6.179:80/dianli'; // 测试服
// var rooturl='http://192.168.0.110:8081/dianli';   //刘冬ip地址
// var rooturl = 'http://www.cloudelec.com:8081/dianli'; //云电微视正式服务器域名
/*
 * url 请求接口
 * data 请求参数
 * func
 * */
var POST = function (url, data, func, befback, compback, async = true, err) {
	data.token = sessionStorage.token;
	$.ajax({
		url: rooturl + url,
		type: 'POST',
		dataType: 'JSON',
		async: async,
		data: data,
		error: function (e) {
			console.log(e);
			if ($('.loadjy')[0]) $('.loadjy').removeClass('op');
			if (err) err();
		},
		beforeSend: function () {
			if (befback) befback();
		},
		success: function (res) {
			if (res.code == "9997" || res.code == "11002" || res.code == undefined) {
				window.parent.location.href = sessionStorage.menuTab == "admin" ? 'alogin.html' : 'login.html';
			};
			if (!sessionStorage.token || sessionStorage.token == '' || sessionStorage.token == undefined) {
				window.parent.location.href = sessionStorage.menuTab == "admin" ? 'alogin.html' : 'login.html';
			};
			func(res);
			var _h = $('html').height(); /*编辑时同步iframe高度*/
			window.parent.$('#iframepage').css({
				'min-height': _h + 30 + 'px'
			});
		},
		complete: function () {
			if (compback) compback();
		}
	});
}

function getPropetyVal(p) {
	var s = location.search;
	s = s.substr(1, s.length - 1);
	var propetys = s.split("&");
	for (var i = 0; i < propetys.length; i++) {
		if (propetys[i].split("=")[0].trim() == p) {
			return propetys[i].split("=")[1];
		}
	}
	return null;
}


// 控制页面的显示
jQuery(function ($) {
	// 控制左边扇形的收缩和显示完整
	//$('[data-rel="tooltip"]').tooltip({placement: tooltip_placement});
	function tooltip_placement(context, source) {
		var $source = $(source);
		var $parent = $source.closest('table')
		var off1 = $parent.offset();
		var w1 = $parent.width();

		var off2 = $source.offset();
		var w2 = $source.width();

		if (parseInt(off2.left) < parseInt(off1.left) + parseInt(w1 / 2)) return 'right';
		return 'left';
	}

	// 全选
	$('table th input:checkbox').on('click', function () {
		var that = this;
		$(this).closest('table').find('tr > td:first-child input:checkbox')
			.each(function () {
				this.checked = that.checked;
				$(this).closest('tr').toggleClass('selected');
			});

	});

});

//初始化宽度、高度
// $(".chart_style").height($(window).height() - 215);
// $(".table_menu_list").height($(window).height() - 215);
// $(".table_menu_list ").width($(window).width() - 440);
//当文档窗口发生改变时 触发
// $(window).resize(function () {
// 	$(".chart_style").height($(window).height() - 215);
// 	$(".table_menu_list").height($(window).height() - 215);
// 	$(".table_menu_list").width($(window).width() - 440);
// });

//面包屑返回值
var index = parent.layer.getFrameIndex(window.name);
parent.layer.iframeAuto(index);
$('.Order_form ,.brond_name').on('click', function () {
	var cname = $(this).attr("title");
	var cnames = parent.$('.Current_page').html();
	var herf = parent.$("#iframe").attr("src");
	parent.$('#parentIframe span').html(cname);
	parent.$('#parentIframe').css("display", "inline-block");
	parent.$('.Current_page').attr("name", herf).css({
		"color": "#4c8fbd",
		"cursor": "pointer"
	});
	//parent.$('.Current_page').html("<a href='javascript:void(0)' name="+herf+">" + cnames + "</a>");
	parent.layer.close(index);

});


// 基本变量
var page = 1;
var limit = 10;
var allnum = 0;
var nowpage = 1;
var allpaper = 0;
var toPage = 0;
var numTotal = 0;

/*用户-查询*/
$('.btn_search').bind('click', function (e) {
	$('.nowpage').text(1);
	manageQueryData(1);
});
// 下一页
$('input[rel="after"]').on('click', function () {
	nowpage = parseInt($('.nowpage').text());
	allpaper = $('.numtotal').text();
	if (nowpage < allpaper) {
		$(".nowpage").text(nowpage + 1);
		manageQueryData(nowpage + 1); // 组织条件查询
	}
});

// 上一页
$('input[rel="prev"]').on('click', function () {
	nowpage = parseInt($('.nowpage').text());
	if (nowpage >= 2) {
		$(".nowpage").text(nowpage - 1);
		manageQueryData(nowpage - 1); // 组织条件查询
	}
});

// 首页
$('input[rel="1"]').on('click', function () {
	toPage = 1;
	numTotal = $('.numtotal').text();
	$(".nowpage").text(toPage);
	if (toPage <= numTotal) {
		manageQueryData(toPage); // 组织条件查询
	}
});

// 尾页
$('input[rel="total"]').on('click', function () {
	numTotal = $('.numtotal').text();
	$(".nowpage").text(numTotal);
	if (numTotal > 0) {
		manageQueryData(numTotal); // 组织条件查询
	}
});



$(function () {
	/**导航 */
	$('.two_header_nav li[id]').click(function () {
		sessionStorage.navId = $(this).attr('id');
		$(window.parent.document).find('.nav').removeClass('navfull');
	});
	if(sessionStorage.navId!=undefined){// 有则点击该菜单，没有则点击第一个菜单
		$('.two_header_nav li[id=' + sessionStorage.navId + ']').click();
	}else{
		$('.two_header_nav li[id]:first-child').click();
	};
	///////删除不需要的菜单
	if (sessionStorage.menuTab == "xj") {
		$('#back1_manager').remove();
		$('#back2_company').remove();
		$('#back7_feedBack').remove();
		$('#back12_version').remove();
		$('.xja').show();
	};
	if (sessionStorage.menuTab == "admin") {
		$('.admina').show();
	};
	// 如果token存在且返回的地址存在index或者存在login
	// 禁止浏览器回退事件
	if((sessionStorage.token && window.parent.location.href.indexOf("index") > -1) || location.href.indexOf("login") > -1){
		history.pushState(null, null, document.URL);
		window.addEventListener('popstate', function () {
			history.pushState(null, null, document.URL);
		});
	};
})

// 监听是否全屏
window.onload = function () {
	var _dom = $("#iframepage").contents().find(".no-screen");
	document.addEventListener('fullscreenchange', function () {
		if (!document.fullscreen) {
			if (!_dom.hasClass('full-screen')) {
				$("#iframepage").contents().find(".no-screen").addClass('full-screen');
				$("#iframepage").contents().find('#line-detail').removeClass('full');
			}
		};
	}, false);
	document.addEventListener('mozfullscreenchange', function () {
		if (!document.mozFullScreen) {
			if (!_dom.hasClass('full-screen')) {
				$("#iframepage").contents().find(".no-screen").addClass('full-screen');
				$("#iframepage").contents().find('#line-detail').removeClass('full');
			}
		};
	}, false);
	document.addEventListener('webkitfullscreenchange', function () {
		if (!document.webkitIsFullScreen) {
			if (!_dom.hasClass('full-screen')) {
				$("#iframepage").contents().find(".no-screen").addClass('full-screen');
				$("#iframepage").contents().find('#line-detail').removeClass('full');
			}
		};
	}, false);
	document.addEventListener('msfullscreenchange', function () {
		if (!document.msFullscreenElement) {
			if (!_dom.hasClass('full-screen')) {
				$("#iframepage").contents().find(".no-screen").addClass('full-screen');
				$("#iframepage").contents().find('#line-detail').removeClass('full');
			}
		};
	}, false);
}
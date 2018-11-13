$('.findClues_N').on('click', function () {
  window.parent.$("#iframepage").attr("src", 'back8_2_FaultServerFault.html?v=1.1.0&deviceIds=' +
    sessionStorage.queryServerFaultIds);
  sessionStorage.navId = 'back1_manager'; /*默认点击第一个导航,暂时*/
  $(window.parent.document).find('.nav').removeClass('navfull');
  for (let i = 0; i < $(".two_header_nav li").length; i++) {
    if (i == 4) {
      $($(".two_header_nav li")[i - 1]).addClass('active')
    } else {
      $($(".two_header_nav li")[i - 1]).removeClass('active')
    }
  }
})

layer.config({
  skin: 'demo-class'
})
$('#manager').text(sessionStorage.account);

$('#Exit_system').on('click', function () {
  layer.confirm('是否确定退出系统？', {
      btn: ['是', '否'], //按钮
      icon: 2,
    },
    function loginOut() {
      if (sessionStorage.menuTab == "admin") {
        window.location.href = 'alogin.html';
      } else {
        window.location.href = 'login.html';
      };
      sessionStorage.clear();
    });
});

init();

function init() { /*控制高度*/
  var html = '<li class="title">  <a href="#"> ' + "管理员" + '</a><span>></span></li>';
  $('#first_li').after(html);

  /* alert(document.documentElement.clientHeight)*/
  var whatHeight = document.documentElement.clientHeight - 170;
  parent.document.getElementById('iframepage').style.height = whatHeight + 'px';


  // 获取故障提醒消息的个数和Id
  queryServerFaultIds();

  //  控制显示
  if (sessionStorage.account != 'admin') {
    $('.two_header_nav ul li').css('width', '250px')
  }

}

function queryServerFaultIds() {
  var data = {};
  POST("/eric/queryServerFaultIds.v1", data, function (res) {
    if (res.code == '0') {
      var result = res.data.list;
      var queryServerFaultIds = '';
      for (var j = 0; j < result.length; j++) {
        queryServerFaultIds += result[j] + ',';
      }
      sessionStorage.queryServerFaultIds = queryServerFaultIds;
      $('.findClues_N').text(res.data.count);
    }
  });
}

$('.two_header_nav li').click(function () {
  var datasrc = $(this).find('img').attr('datasrc')
  $("#iframepage").attr("src", datasrc);

  var obj = $('.public img').parent().parent()
  var arr = []
  for (var i in obj) {
    arr.push(obj[i]); //属性
  }
  arr.length = 8
  for (var k of arr) {
    $(k).removeClass('active')
  }
  $(this).addClass('active')

})

$(function () {
  var frameH = $(window).height() - 119 + 'px';
  $('#iframepage').height(frameH);
  $(window).resize(function () {
    var frameH = $(window).height() - 119 + 'px';
    $('#iframepage').height(frameH);
  });
  /* 点击按钮取消全屏 */
  $('button.nofull').click(function () {
    exitFullScreen();
  });

  function exitFullScreen() {
    var el = document,
      cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
      wscript;
    if (typeof cfs != "undefined" && cfs) {
      cfs.call(el);
      return;
    }
    if (typeof window.ActiveXObject != "undefined") {
      wscript = new ActiveXObject("WScript.Shell");
      if (wscript != null) {
        wscript.SendKeys("{F11}");
      }
    }
  }
  /**全屏 */
  /* 点击按钮全屏 */
  $('button.full').click(function () {
    fullScreen();
  });

  function fullScreen() {
    var el = document.documentElement,
      rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
      wscript;
    if (typeof rfs != "undefined" && rfs) {
      rfs.call(el);
      return;
    }
    if (typeof window.ActiveXObject != "undefined") {
      wscript = new ActiveXObject("WScript.Shell");
      if (wscript) {
        wscript.SendKeys("{F11}");
      }
    }
  }
  // 日期
  getToday();
  setInterval(x => {
    getToday();
  }, 1000);

  function getToday() {
    var d = new Date();
    // 处理年月日
    var y = d.getFullYear(),
      m = d.getMonth() + 1,
      d1 = d.getDate(); // 年月日
    var date = `${y}年${m<10?'0'+m:m}月${d1<10?'0'+d1:d1}日`;
    // 处理周
    var w = d.getDay(); // 周
    var weekArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var week = weekArr[w];
    // 处理时分秒
    var h = d.getHours(),
      m1 = d.getMinutes(),
      s = d.getSeconds(); // 时分秒
    var time = `${h<10?'0'+h:h}:${m1<10?'0'+m1:m1}:${s<10?'0'+s:s}`;
    $('.dates .date').text(date);
    $('.dates .week').text(week);
    $('.dates .time').text(time);
  }
})
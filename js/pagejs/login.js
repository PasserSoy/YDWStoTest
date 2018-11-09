sessionStorage.clear();
//验证帐号密码
function backLogin() {
  var account = $('#account').val();
  var password = $('#password').val();
  var url = '/back/login/login.v1'; // 默认admin的地址
  var user = $('#main').data('user'); // 当前用户
  if (user == 'admin') { // 用户为admin
    sessionStorage.menuTab = "admin";
  } else { // 用户为巡检员
    password = $('#password').val() == '' ? '' : hex_md5($('#password').val());
    url = '/back/login/memberLogin.v1';
    sessionStorage.menuTab = "xj";
  };
  var data = {
    account: account,
    password: password
  };
  if (account != '' && password != '') {
    POST(url, data, function (res) {
      if (res.code == '0') {
        layer.alert('登陆成功！', {
          title: '提示框',
          icon: 1,
        });
        // console.log(res.data)
        sessionStorage.id = res.data.id;
        sessionStorage.account = res.data.account != undefined ? res.data.account : res.data.userName; //登录帐号名
        sessionStorage.token = res.data.token;
        sessionStorage.permission = res.data.permission;
        window.location.href = "index.html?v=1.1.0";
        layer.alert(res.msg, {
          title: '提示框',
          icon: 0,
        });
      };
    });
  } else {
    layer.alert('帐号或密码不能为空!', {
      title: '提示框',
      icon: 0,
    });
  }
}

$('.submit_btns').on('click', function (event) {
  backLogin();
});

$("body").keydown(function () {
  if (event.keyCode == "13") { //keyCode=13是回车键
    backLogin();
  }
});
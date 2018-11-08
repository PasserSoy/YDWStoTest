sessionStorage.clear();
//验证帐号密码
function backLogin() {
  var account = $('#account').val();
  var password = $('#password').val();
  var data = {
    account: account,
    password: password
  };
  ///////当前账户为管理员
  sessionStorage.menuTab = "admin";
  if (account != '' && password != '') {
    $.ajax({
      url: rooturl + "/back/login/login.v1",
      type: 'POST',
      dataType: 'JSON',
      data: data,
      error: function (e) {
        console.log(e)
      },
      success: function (res) {
        if (res.code == '0') {
          layer.alert('登陆成功！', {
            title: '提示框',
            icon: 1,
          });
          console.log(res.data)
          sessionStorage.id = res.data.id;
          sessionStorage.account = res.data.account; //登录帐号名
          sessionStorage.token = res.data.token;
          sessionStorage.permission = res.data.permission;
          sessionStorage.navId = 'back1_manager'; /*默认点击第一个导航*/
          window.location.href = "index.html";
        } else {
          layer.alert(res.msg, {
            title: '提示框',
            icon: 0,
          });
        }
      }
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
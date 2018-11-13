$(function () {
  sessionStorage.token=sessionStorage.token!=undefined?sessionStorage.token:'password';
  var rooturl = '/back/sysUser/';
  var user = $('#password').data('user');
  if(user=='xj'){// 巡检员
    rooturl = '/api/member/';
  };
  // 获取验证码
  $('.send').click(function () {
    var tel = $('.tel').val();
    if (tel == '') {
      layer.msg('请填写手机号', {
        time: 1000
      });
    } else {
      POST(rooturl+'sendSmsCode.v1',{mobileOrEmail: tel, type: 3},function(res){
        if (res.msg == '成功') {
          layer.msg('验证码已发送成功', {
            time: 1000
          });
        } else {
          layer.msg(res.msg, {
            time: 1000
          });
        };
      });
    }
  });
  // 修改密码
  $('.confirm').click(function () {
    var tel = $('.tel').val();
    var newpw = $('.newpw').val();
    var valid = $('.valid').val();
    if (newpw == '') {
      layer.msg('请填写密码', {
        time: 1000
      });
    } else {
      if (tel == '') {
        layer.msg('请填写手机号', {
          time: 1000
        });
      } else {
        if (valid == '') {
          layer.msg('请填写验证码', {
            time: 1000
          });
        } else { // 密码、手机号、验证码都已填写
          POST(rooturl + 'updatePasswordBySmsCode.v1', {
            mobileOrEmail: tel,
            password: newpw,
            smsCode: valid
          }, function (res) {
            if (res.msg == '成功') {
              layer.msg(res.msg, {
                time: 1000
              });
            } else {
              layer.msg(res.msg, {
                time: 1000
              });
            }
          })
        }
      }
    }

  });
  // 返回
  $('.back').click(function () {
    history.back();
  });
})
$(function () {
  sessionStorage.token=sessionStorage.token!=undefined?sessionStorage.token:'password';
  var rooturl = '/back/sysUser/';
  var endUrl='updatePasswordBySmsCode.v2';
  var user = $('#password').data('user');
  if(user=='xj'){// 巡检员
    rooturl = '/api/member/';
    endUrl='updatePasswordBySmsCode.v1';
  };
  // 获取验证码
  $('.send').click(function () {
    var tel = $('.tel').val();
    var data = {type: 3};
    user=='xj'?data.mobileOrEmail=tel:data.mobileOrAccount=tel;
    if (tel == '') {
      layer.msg('请填写手机号', {
        time: 1000
      });
    } else {
      POST(rooturl+'sendSmsCode.v1',data,function(res){
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
    var data = {password: newpw,smsCode: valid};
    user=='xj'?data.mobileOrEmail=tel:data.mobileOrAccount=tel;
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
          POST(rooturl + endUrl,data, function (res) {
            if (res.msg == '成功') {
              layer.msg(res.msg, {
                time: 500
              },function(){
                history.back();
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
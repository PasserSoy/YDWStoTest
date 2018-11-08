layer.config({
  skin: 'layui-layer-molv'
})

//    ================================    图片上传 初始化    ================================
$('#token').val(sessionStorage.token)
document.forms[0].target = "rfFrame";

function UploadFile2() {
  var form1 = $('#file2');
  var file1s1img = $('.file1s2img');
  if (file1s1img.val() != "") {
    form1.submit();
  }
}
$("#file2").ajaxForm(function (data) {
  if (data.data) {
    alert("上传成功");
    $("#url").val(data.data);
  }
});


var callB = false; // 增加、删除的异步操作
var data = {
  page: 1,
  rows: 10
};
queryData(data);

function queryData(data) {
  var allCount=0;// 是否有数据
  POST("/api/version/queryAppVersion.v1", data, function (res) {
    if (res.code == '0') {
      var allnum = res.data.count;
      allCount=allnum;// 是否有数据
      var page = Math.ceil(allnum / 10);
      $('.numtotal').text(page);
      $('.numtotalpp').text(allnum);
      var list = res.data.list;
      $('#tbody').empty();
      $('.ui_input_txt01').attr('max', page);
      $('.ui_input_txt01').val($(".nowpage").text());
      var html = '';
      for (var i = 0; i < list.length; i++) {
        if (!list[i].versionName) {
          list[i].versionName = '-'
        }
        if (!list[i].version) {
          list[i].version = '-'
        }
        if (!list[i].remarks) {
          list[i].remarks = '-'
        }
        if (!list[i].createTime) {
          list[i].createTime = '-'
        }
        var serial = (parseInt($(".nowpage").text()) - 1) * parseInt(10) + parseInt(i) + parseInt(1);
        html += '<tr>' +
          '<td>' + serial + '</td>' +
          '<td>' + list[i].versionName + '</td>' +
          '<td>' + list[i].version + '</td>' +
          '<td>' + list[i].remarks + '</td>' +
          '<td>' + list[i].createTime + '</td>' +
          '<td class="td-manage">' +
          '<a onClick=' + 'member_edit(this,"550")' + ' dataId="' + list[i].id + '" dataVersionName="' + list[i].versionName + '" dataVersion="' + list[i].version + '" dataRemarks="' + list[i].remarks + '" dataIsMust="' + list[i].isMust + '" dataUrl="' + list[i].url +
          '"  href="javascript:;" title="编辑" id="edit">' + '编辑</a> &nbsp;&nbsp;' +
          '<a onClick=' + 'member_del(this,"1")' + ' dataId="' + list[i].id + '" href="javascript:;" title="删除" id="delete" >删除</a>' +
          '</td>' +
          '</tr>';
      }
      $('#tbody').append(html);

      if ($('.numtotal').text() == '1') {
        $('.beforPage').css({
          background: '#ccc',
          cursor: 'default'
        })
        $('.laterPage').css({
          background: '#ccc',
          cursor: 'default'
        })
      } else {
        if ($('.nowpage').text() == '1') {
          $('.beforPage').css({
            background: '#ccc',
            cursor: 'default'
          })
          $('.laterPage').css({
            background: '#2494f9',
            cursor: 'pointer'
          })
        } else if ($('.nowpage').text() == $('.numtotal').text()) {
          $('.beforPage').css({
            background: '#2494f9',
            cursor: 'pointer'
          })
          $('.laterPage').css({
            background: '#ccc',
            cursor: 'default'
          })
        } else {
          $('.beforPage').css({
            background: '#2494f9',
            cursor: 'pointer'
          })
          $('.laterPage').css({
            background: '#2494f9',
            cursor: 'pointer'
          })
        }
      }
    };
    if(allCount==0){// 是否有数据
      $('#noTableData').show();$('#Member_Ratings').hide();
    }else{
      $('#noTableData').hide();$('#Member_Ratings').show();
    };
  }, function () {
    $('.loadjy').addClass('op');
  }, function () {
    $('.loadjy').removeClass('op');
    callB = true;
  }, true);
}


// 组织查询
function manageQueryData(nowpage) {
  data = {
    page: nowpage,
    rows: 10
  };
  queryData(data);
}

/*用户-删除*/
function member_del(obj, id) {
  var appIds = $(obj).attr("dataId");
  var data = {
    appIds: appIds
  };
  layer.open({
    title: "提示",
    content: '确认要删除信息？',
    offset: ['40px'],
    area: ['350px'],
    btn: ['取消', '确认'],
    yes: function (index) {
      layer.close(index); //如果设定了yes回调，需进行手工关闭
    },
    btn2: function (index) {
      nowpage = $('.nowpage').text();
      // $(obj).parents("tr").remove();
      nowpage = $('#tbody tr').length <= 1 ? nowpage - 1 : nowpage;
      version_del_Info(data, nowpage);
      layer.close(index);
      $(".nowpage").text(parseInt(nowpage));
      // manageQueryData(nowpage);// 组织条件查询
    }
  });

  // layer.confirm('确认要删除信息？',function(index){
  // 	version_del_Info(data);
  // 	$(obj).parents("tr").remove();
  // 	layer.close(index);
  // 	$(".nowpage").text(parseInt(nowpage));
  // 	manageQueryData(nowpage);// 组织条件查询
  // });
}

//删除信息:被引用
function version_del_Info(data, nowpage) {
  callB = false;
  POST("/api/version/deleteAppVersion.v1", data, function (res) {
    manageQueryData(nowpage); // 组织条件查询
    var s = setInterval(x => {
      if (callB == true) {
        if (res.code == '0') {
          layer.msg('已删除!', {
            icon: 1,
            time: 1000
          });
          //location.reload()
        } else {
          layer.msg(res.msg, {
            icon: 1,
            time: 1000
          });
        };
        clearInterval(s);
      };
    }, 1);
  }, function () {
    $('.loadjy').addClass('op');
  }, '', true);
}


/*用户-添加*/
$('#member_add').on('click', function () {
  $('#versionName').val('');
  $("#isMust_selected").prop("selected", 'selected');
  $('#url').val('');
  $('#remarks').val('');
  $('#version').val('');
  layer.open({
    type: 1,
    closeBtn: 1,
    title: '添加',
    // shadeClose: true, //点击遮罩关闭层
    offset: ['40px'],
    area: ['450px'],
    content: $('#add_menber_style'),
    btn: ['保存', '取消'],
    yes: function (index, layero) {
      var isMust_add = $('select[name="isMust"]').val();
      var versionName_add = $('#versionName').val();
      var version_add = $('#version').val();
      var remarks_add = $('#remarks').val();
      var url_add = $('#url').val();
      //				var isAdmin =  $('input:radio[name=form-field-radio1]:checked').val();
      var data = {
        versionName: versionName_add,
        isMust: isMust_add,
        url: url_add,
        remarks: remarks_add,
        version: version_add
      };
      $('.nowpage').text('1');
      addOrUpdateAppVersion(data, 1);
      layer.close(index);
      // manageQueryData(1);
    }
  });
});

function addOrUpdateAppVersion(data, nowpage) {
  callB = false;
  POST("/api/version/addOrUpdateAppVersion.v1", data, function (res) {
    manageQueryData(nowpage);
    var s = setInterval(x => {
      if (callB == true) {
        if (res.code == '0') {
          layer.alert('成功！', {
            title: '提示框',
            icon: 1,
          });
        } else {
          layer.msg(res.msg, {
            icon: 1,
            time: 1000
          });
        };
        clearInterval(s);
      };
    }, 1);
  }, function () {
    $('.loadjy').addClass('op');
  }, '', true);
}

//  -==========================================
/*用户-编辑*/
function member_edit(obj, id) {
  $('#versionName').val('');
  $("#isMust_selected").prop("selected", 'selected');
  $('#url').val('');
  $('#remarks').val('');
  $('#version').val('');

  var appVersionId = $(obj).attr('dataId');
  var dataVersionName = $(obj).attr('dataVersionName');
  var dataVersion = $(obj).attr('dataVersion');
  var dataRemarks = $(obj).attr('dataRemarks');
  var dataIsMust = $(obj).attr('dataIsMust');
  var dataUrl = $(obj).attr('dataUrl');

  $('#versionName').val(dataVersionName);
  $('#version').val(dataVersion);
  $('#remarks').val(dataRemarks);
  $("#isMust_selected").prop("selected", 'selected');
  $('#url').val(dataUrl);

  $('select[name="isMust"] option').each(function () {
    if ($(this).val() == dataIsMust) {
      $(this).attr("selected", true);
    }
  });
  layer.open({
    type: 1,
    closeBtn: 1,
    title: '修改',
    // shadeClose:false, //点击遮罩关闭层
    offset: ['40px'],
    area: ['450px'],
    content: $('#add_menber_style'),
    btn: ['保存', '取消'],
    yes: function (index, layero) {
      var isMust_edit = $('select[name="isMust"]').val();
      var versionName_edit = $('#versionName').val();
      var version_edit = $('#version').val();
      var remarks_edit = $('#remarks').val();
      var url_edit = $('#url').val();
      var data = {
        appVersionId: appVersionId,
        versionName: versionName_edit,
        isMust: isMust_edit,
        url: url_edit,
        remarks: remarks_edit,
        version: version_edit
      };
      nowpage = $('.nowpage').text();
      addOrUpdateAppVersion(data, nowpage);
      layer.close(index);
      // manageQueryData(nowpage);
    }
  });
}
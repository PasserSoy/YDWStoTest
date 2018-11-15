layer.config({
  skin: 'layui-layer-molv'
})
//    alert(sessionStorage.permission)
//    alert(sessionStorage.permission.indexOf("授权")>=0 || sessionStorage.permission.indexOf("添加")>=0)
if (sessionStorage.permission.indexOf("授权") >= 0 || sessionStorage.permission.indexOf("添加") >= 0) {
  $('#btn-2').show()
} else {
  $('#btn-2').hide()
}

var companyId = getPropetyVal('companyId');
var companyName = decodeURI(getPropetyVal('companyName'));
//缓存存储
if (companyId) {
  sessionStorage.companyId = companyId;
}
if (companyName != 'null') {
  sessionStorage.companyName = companyName;
} // 这里中文默认4个长度


$('#companyName').text(sessionStorage.companyName);
$('#btn-2').on('click', function () {
  window.parent.$("#iframepage").attr("src", 'back3_1_MonitorMember.html?v=1.1.0');
})

$('#back_to_company').on('click', function () {
  window.parent.$("#iframepage").attr("src", 'back2_company.html?v=1.1.0');
})

var callB = false; // 增加、删除的异步操作
var stationName_find = $("#stationName_find").val();
var data = {
  page: 1,
  rows: 10,
  companyId: sessionStorage.companyId,
  flag: 'three',
  stationName: stationName_find,
  annotation: 'MonitorStation'
};
queryData(data);

function queryData(data) {
  var allCount=0;// 是否有数据
  POST("/sys/monitorStation/queryMonitorStation.v1", data, function (res) {
    if (res.code == '0') {
      var allnum = res.data.count;
      allCount=allnum;// 是否有数据
      var page = Math.ceil(allnum / 10);
      $('.numtotal').text(page);
      $('.numtotalpp').text(allnum);
      $('#stationCount').text(allnum);
      var list = res.data.list;
      $('#tbody').empty();
      $('.ui_input_txt01').attr('max', page);
      $('.ui_input_txt01').val($(".nowpage").text());
      var html = '';
      for (var i = 0; i < list.length; i++) {
        if (!list[i].stationName) {
          list[i].stationName = '-'
        }
        if (!list[i].stationAddress) {
          list[i].stationAddress = '-'
        }
        if (!list[i].longitudeAndlatitude) {
          list[i].longitudeAndlatitude = '-'
        }
        if (!list[i].createTime) {
          list[i].createTime = '-'
        }
        var serial = (parseInt($(".nowpage").text()) - 1) * parseInt(10) + parseInt(i) + parseInt(1);
        html += '<tr>' +
          '<td>' + serial + '</td>' +
          '<td>' + list[i].stationName + '</td>' +
          '<td>' + list[i].stationAddress + '</td>' +
          '<td>' + list[i].longitudeAndlatitude + '</td>' +
          '<td><a href="back4_LinesOnMaster.html?v=1.1.0&monitorStationId=' + list[i].id + '">' + list[i].linesOnMasterCount + '</a></td>' +
          /*'<td><a href="back5_LinesOnBranch.html?monitorStationId="'+list[i].id+'>'+list[i].linesOnBranchCount+'</a></td>'+
          '<td><a href="back6_MonitorPoint.html?monitorStationId="'+list[i].id+'>'+list[i].monitorPointCount+'</a></td>'+*/
          '<td>' + list[i].linesOnBranchCount + '</a></td>' +
          '<td>' + list[i].monitorPointCount + '</a></td>' +
          '<td>' + list[i].createTime + '</td>' +
          '<td class="td-manage">' +
          '<a onClick=' + 'member_edit(this,"550")' + ' dataid="' + list[i].id + '" dataStationName="' + list[i].stationName + '" dataStationAddress="' + list[i].stationAddress +
          '" dataLongitudeAndlatitude="' + list[i].longitudeAndlatitude + '"  href="javascript:;" title="编辑" id="edit">' +
          '编辑</a> &nbsp;&nbsp;' +
          '<a onClick=' + 'member_del(this,"1")' + ' dataid="' + list[i].id + '" href="javascript:;" title="删除" id="delete" >删除</a>' +
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
      $('#noTableData').show();$('.data_show,#Member_Ratings').hide();
    }else{
      $('#noTableData').hide();$('.data_show,#Member_Ratings').show();
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
  stationName_find = $("#stationName_find").val();
  data = {
    page: nowpage,
    rows: 10,
    companyId: sessionStorage.companyId,
    flag: 'three',
    stationName: stationName_find,
    annotation: 'MonitorStation'
  };
  queryData(data);
}

/*用户-删除*/
function member_del(obj, id) {
  var dataid = $(obj).attr("dataid");
  var data = {
    monitorStationIds: dataid,
    annotation: 'MonitorStation'
  };
  layer.open({
    title: "提示",
    content: '确认要删除该监测站吗？',
    offset: ['40px'],
    area: ['350px'],
    btn: ['取消', '确认'],
    yes: function (index) {
      layer.close(index); //如果设定了yes回调，需进行手工关闭
    },
    btn2: function (index) {
      nowpage = $('.nowpage').text();
      nowpage = $('#tbody tr').length <= 1 ? nowpage - 1 : nowpage;
      monitorStation_del(data, nowpage)
      // $(obj).parents("tr").remove();
      // console.log(obj)
      layer.close(index);
      $(".nowpage").text(parseInt(nowpage));
      // manageQueryData(nowpage);// 组织条件查询
    }
  });
}
//删除信息:被引用
function monitorStation_del(data, nowpage) {
  callB = false;
  POST("/sys/monitorStation/deleteMonitorStation.v1", data, function (res) {
    manageQueryData(nowpage); // 组织条件查询
    // console.log(res)
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
$('#monitorStation_add').on('click', function () {
  $("#stationName").val('');
  $("#stationAddress").val('');
  $("#longitudeAndlatitude").val('');
  layer.open({
    type: 1,
    closeBtn: 1,
    title: '添加监测站',
    // maxmin: true,
    // shadeClose: true, //点击遮罩关闭层
    offset: ['40px'],
    area: ['400px'],
    content: $('#add_monitorStation_style'),
    btn: ['提交', '取消'],
    yes: function (index, layero) {
      var stationName_add = $('#stationName').val();
      var stationAddress_add = $('#stationAddress').val();
      var longitudeAndlatitude_add = $('#longitudeAndlatitude').val();

      if (!stationName_add) {
        layer.alert("请填写监测站名称！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      if (!stationAddress_add) {
        layer.alert("请填写监测站所在地区！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      if (!longitudeAndlatitude_add) {
        layer.alert("请填写监测站经纬度！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }

      var data = {
        companyId: sessionStorage.companyId,
        stationName: stationName_add,
        stationAddress: stationAddress_add,
        longitudeAndlatitude: longitudeAndlatitude_add,
        annotation: 'MonitorStation'
      };
      $('.nowpage').text('1');
      addOrUpdateMonitorStation(data, 1);
      layer.close(index);
      // manageQueryData(1);
    }
  });
});


/*用户-编辑*/
function member_edit(obj, id) {
  $("#stationName").val('');
  $("#stationAddress").val('');
  $("#longitudeAndlatitude").val('');

  var monitorStationId = $(obj).attr('dataId');
  var dataStationName = $(obj).attr('dataStationName');
  var dataStationAddress = $(obj).attr('dataStationAddress');
  var dataLongitudeAndlatitude = $(obj).attr('dataLongitudeAndlatitude');

  $("#stationName").val(dataStationName);
  $("#stationAddress").val(dataStationAddress);
  $("#longitudeAndlatitude").val(dataLongitudeAndlatitude);
  layer.open({
    type: 1,
    closeBtn: 1,
    title: '编辑监测站',
    // maxmin: true,
    // shadeClose:false, //点击遮罩关闭层
    offset: ['40px'],
    area: ['400px'],
    content: $('#add_monitorStation_style'),
    btn: ['提交', '取消'],
    yes: function (index, layero) {
      var stationName_edit = $('#stationName').val();
      var stationAddress_edit = $('#stationAddress').val();
      var longitudeAndlatitude_edit = $('#longitudeAndlatitude').val();
      if (!stationName_edit) {
        layer.alert("请填写监测站名称！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      if (!stationAddress_edit) {
        layer.alert("请填写监测站所在地区！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      if (!longitudeAndlatitude_edit) {
        layer.alert("请填写监测站经纬度！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      var data = {
        monitorStationId: monitorStationId,
        companyId: sessionStorage.companyId,
        stationName: stationName_edit,
        stationAddress: stationAddress_edit,
        longitudeAndlatitude: longitudeAndlatitude_edit,
        annotation: 'MonitorStation'
      };
      nowpage = $('.nowpage').text();
      addOrUpdateMonitorStation(data, nowpage);
      layer.close(index);
      // manageQueryData(nowpage);
    }
  });
}

// 功能函数  公司保存
function addOrUpdateMonitorStation(data, nowpage) {
  callB = false;
  POST("/sys/monitorStation/addOrUpdateMonitorStation.v1", data, function (res) {
    manageQueryData(nowpage); // 组织条件查询
    var s = setInterval(x => {
      if (callB == true) {
        if (res.code == '0') {
          console.log(res)
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



$('.btn_search').click(function () {
  var stationName_find = $("#stationName_find").val();
  var data = {
    page: 1,
    rows: 10,
    companyId: sessionStorage.companyId,
    flag: 'three',
    stationName: stationName_find
  };
  queryData(data);
})
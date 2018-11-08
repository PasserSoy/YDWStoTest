layer.config({
  skin: 'layui-layer-molv'
})

var monitorStationId = getPropetyVal('monitorStationId');
if (monitorStationId) {
  sessionStorage.monitorStationId = monitorStationId; //登录帐号名
}


$('.back_to_MonitorStation').on('click', function () {
  window.parent.$("#iframepage").attr("src", 'back3_2_MonitorStation.html?v=1.0.0');
})
$('.company_info').on('click', function () {
  window.parent.$("#iframepage").attr("src", 'back2_company.html?v=1.0.0');
})

var mobile = '';
var isActive = '';
var callB = false; // 增加、删除的异步操作

var masterName_find = $("#masterName_find").val();
var data = {
  page: 1,
  rows: 10,
  monitorStationId: sessionStorage.monitorStationId,
  masterName: masterName_find
};
queryData(data);

function queryData(data) {
  var allCount=0;// 是否有数据
  POST("/sys/linesOnMaster/queryLinesOnMaster.v1", data, function (res) {
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
      var line = `<i class="line">离线</i>`;
      for (var i = 0; i < list.length; i++) {
        if (!list[i].masterName) {
          list[i].masterName = '-';
        }
        if (!list[i].preMasterName) {
          list[i].preMasterName = '-';
        }
        // if(!list[i].relatedType){
        //     list[i].relatedType = '-';
        // }
        if (!list[i].monitorFlag) {
          list[i].monitorFlag = '';
        }
        if (!list[i].hitchType) {
          list[i].hitchType = '-';
        }
        if (!list[i].createTime) {
          list[i].createTime = '-';
        }
        if (list[i].online == 'online') {
          line = `<i class="line online">在线</i>`;
        }
        var serial = (parseInt($(".nowpage").text()) - 1) * parseInt(10) + parseInt(i) + parseInt(1);
        html += '<tr>' +
          '<td>' + serial + '</td>' +
          '<td>' + list[i].masterName + '</td>' +
          '<td>' + list[i].preMasterName + '</td>' +
          '<td><a href="back5_LinesOnBranch.html?v=1.0.0&linesOnMasterId=' + list[i].id + '" class="liveA" data-pow="' + list[i].hitchType + '" data-name="' + list[i].masterName + '">' + list[i].linesOnBranchDtos.length + '</a></td>' +
          '<td>' + list[i].monitorFlag + '</td>' +
          // '<td>'+line+'</td>'+
          '<td>' + list[i].hitchType + ' kV</td>' +
          '<td>' + list[i].createTime + '</td>' +
          '<td class="td-manage">' +
          '<a onClick=' + 'member_edit(this,"550")' + ' dataId ="' + list[i].id + '" dataMasterName="' + list[i].masterName + '" dataPreMasterId="' + list[i].preMasterId + '"' +
          ' dataMonitorFlag="' + list[i].monitorFlag + '" dataHitchType="' + list[i].hitchType + '" dataCreateTime="' + list[i].createTime +
          '"  href="javascript:;" title="编辑" id="edit">' +
          '编辑</a> &nbsp;' +
          '<a onClick=' + 'member_del(this,"1")' + ' dataid="' + list[i].id + '" href="javascript:;" title="删除" id="delete" >删除</a> &nbsp;' +
          '<a onClick=' + 'sync800Config(this,"1")' + ' dataId="' + list[i].id + '" dataMonitorFlag="' + list[i].monitorFlag + '" href="javascript:;" title="设置" id="delete">同步</a>' +
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
      //实时预览
      // livepreview(res.data.list);
    }; /*./res.code*/
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
  masterName_find = $("#masterName_find").val();
  data = {
    page: nowpage,
    rows: 10,
    monitorStationId: sessionStorage.monitorStationId,
    masterName: masterName_find
  };
  queryData(data);
}

/*用户-删除*/
function member_del(obj, id) {
  var dataid = $(obj).attr("dataid");
  var data = {
    monitorStationIds: dataid
  };
  layer.open({
    title: "提示",
    content: '删除此母线，包含的支线将一起删除，确定要继续吗？',
    offset: ['40px'],
    area: ['350px'],
    btn: ['取消', '确认'],
    yes: function (index) {
      layer.close(index); //如果设定了yes回调，需进行手工关闭
      $(".nowpage").text(parseInt(nowpage));
      manageQueryData(nowpage); // 组织条件查询
    },
    btn2: function (index) {
      nowpage = $('.nowpage').text();
      nowpage = $('#tbody tr').length <= 1 ? nowpage - 1 : nowpage;
      linesOnMaster_del_Info(data, nowpage)
      // $(obj).parents("tr").remove();
      layer.close(index);
      $(".nowpage").text(parseInt(nowpage));
      // manageQueryData(nowpage);// 组织条件查询
    }
  });
}

//删除信息:被引用
function linesOnMaster_del_Info(data, nowpage) {
  callB = false;
  POST("/sys/linesOnMaster/deleteLinesOnMaster.v1", data, function (res) {
    // console.log(res)
    manageQueryData(nowpage); // 组织条件查询
    var s = setInterval(x => {
      if (callB == true) {
        if (res.code == '0') {
          layer.msg('已删除!', {
            icon: 1,
            time: 1000
          });
        } else {
          layer.msg(res.msg, {
            icon: 0,
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


function initMasterList(linesOnMasterId_edit) {
  var data = {
    monitorStationId: sessionStorage.monitorStationId,
    type: "pc",
    linesOnMasterId_edit: linesOnMasterId_edit
  };
  $('select[name="preMasterId"]').empty();
  POST("/sys/linesOnMaster/queryLinesOnMasterIds.v1", data, function (res) {
    if (res.code == '0') {
      var resultList = res.data;
      var selected_dataName = '<option  id="preMasterId_selected" value="">请选择</option>';
      for (var i = 0; i < resultList.length; i++) {
        selected_dataName += '<option  value="' + resultList[i].id + '">' + resultList[i].masterName + '</option>';
      }
      $('select[name="preMasterId"]').append(selected_dataName);
    }

  });
}




/*用户-添加*/
$('#member_add').on('click', function () {
  initMasterList();
  $("#masterName").val('');
  $("#preMasterId_selected").prop("selected", 'selected');
  // $("#relatedType_selected").prop("selected", 'selected');
  $("#monitorFlag").val('');
  $("#hitchType_selected").prop("selected", 'selected');

  layer.open({
    type: 1,
    closeBtn: 1,
    title: '添加母线',
    // maxmin: true,
    // shadeClose: true, //点击遮罩关闭层
    offset: ['40px'],
    area: ['400px'],
    content: $('#add_menber_style'),
    btn: ['提交', '取消'],
    yes: function (index, layero) {
      var masterName_add = $('#masterName').val();
      var preMasterId_add = $('select[name="preMasterId"]').val();
      // var relatedType_add  =  $('select[name="relatedType"]').val();
      var monitorFlag_add = $('#monitorFlag').val();
      var hitchType_add = $('select[name="hitchType"]').val();

      if (!masterName_add) {
        layer.alert("请填写母线名称！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      // if(!preMasterId_add){
      //     layer.alert("请填写上一段母线！\r\n",{title: '提示框',  icon:0,});
      //     return;
      // }
      if (!hitchType_add) {
        layer.alert("请填写电压等级！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      if (!monitorFlag_add) {
        layer.alert("请填写设备标识！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      /// 设备标识验证 只能输入英文加数字
      if (/^[a-zA-Z]\w*$/gi.test(monitorFlag_add) == false) {
        layer.alert("设备标识只能输入英文开头加数字！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }

      // if(!relatedType_add){
      //     layer.alert("请填写关联方式！\r\n",{title: '提示框',  icon:0,});
      //     return;
      // }

      /* if(!relatedType_add){
           layer.alert("请填写关联方式！\r\n",{title: '提示框',  icon:0,});
           return;
       }else{
           if((preMasterId_add && relatedType_add == '无关联') || (!preMasterId_add && relatedType_add == '母线关联') ){
               layer.alert("上一段母线和关联方式保持一致！\r\n",{title: '提示框',  icon:0,});
               return;
           }s
       }
       */

      var data1 = {
        masterName: masterName_add,
        preMasterId: preMasterId_add,
        monitorFlag: monitorFlag_add,
        // relatedType:relatedType_add,
        hitchType: hitchType_add,
        monitorStationId: sessionStorage.monitorStationId
      };
      $('.nowpage').text('1');
      addOrUpdateLinesOnMaster(data1, 1);
      layer.close(index);
      // manageQueryData(1);
    }
  });
});

//保存
function addOrUpdateLinesOnMaster(data, nowpage) {
  callB = false;
  POST("/sys/linesOnMaster/addOrUpdateLinesOnMaster.v1", data, function (res) {
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


//  -==========================================

/*用户-编辑*/
function member_edit(obj, id) {
  var linesOnMasterId = $(obj).attr('dataId');
  initMasterList(linesOnMasterId);
  $("#masterName").val('');
  $("#preMasterId_selected").prop("selected", 'selected');
  // $("#relatedType_selected").prop("selected", 'selected');
  $("#monitorFlag").val('');
  $("#hitchType_selected").prop("selected", 'selected');

  var data_ = {
    monitorStationId: sessionStorage.monitorStationId,
    linesOnMasterId: linesOnMasterId
  };
  POST("/sys/linesOnMaster/queryLinesOnMasterIds.v1", data_, function (res) {
    if (res.code == '0') {
      var resultList = res.data[0];
      // $('select[name="relatedType"]').val(resultList.relatedType)
      $('select[name="preMasterId"]').val(resultList.preMasterId)
      $('select[name="hitchType"]').val(resultList.hitchType)

      $("#masterName").val(resultList.masterName);
      $("#monitorFlag").val(resultList.monitorFlag);
    }
  });


  layer.open({
    type: 1,
    closeBtn: 1,
    title: '编辑母线',
    // maxmin: true,
    // shadeClose:false, //点击遮罩关闭层
    offset: ['40px'],
    area: ['400px'],
    content: $('#add_menber_style'),
    btn: ['提交', '取消'],
    yes: function (index, layero) {
      var masterName_edit = $("#masterName").val();
      var preMasterId_add = $('select[name="preMasterId"]').val();
      var monitorFlag_edit = $("#monitorFlag").val();
      // var relatedType_edit  =  $('select[name="relatedType"]').val();
      var hitchType_edit = $('select[name="hitchType"]').val();

      if (!masterName_edit) {
        layer.alert("请填写母线名称！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      //    if(!preMasterId_add){
      //        layer.alert("请填写上一段母线！\r\n",{title: '提示框',  icon:0,});
      //        return;
      //    }
      if (!hitchType_edit) {
        layer.alert("请填写电压等级！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      if (!monitorFlag_edit) {
        layer.alert("请填写设备标识！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      /// 设备标识验证 只能输入英文加数字
      if (/^[a-zA-Z]\w*$/gi.test(monitorFlag_edit) == false) {
        layer.alert("设备标识只能输入英文开头加数字！\r\n", {
          title: '提示框',
          icon: 0,
        });
        return;
      }
      /*  if(!relatedType_edit){
            layer.alert("请填写关联方式！\r\n",{title: '提示框',  icon:0,});
            return;
        }else{
            if((preMasterId_add && relatedType_edit == '无关联') || (!preMasterId_add && relatedType_edit == '母线关联') ){
                layer.alert("上一段母线和关联方式请保持一致！\r\n",{title: '提示框',  icon:0,});
                return;
            }
        }*/

      var data = {
        linesOnMasterId: linesOnMasterId,
        masterName: masterName_edit,
        preMasterId: preMasterId_add,
        monitorFlag: monitorFlag_edit,
        // relatedType:relatedType_edit,
        hitchType: hitchType_edit,
        monitorStationId: sessionStorage.monitorStationId
      };
      addOrUpdateLinesOnMaster(data);
      layer.close(index);
      nowpage = $('.nowpage').text();
      manageQueryData(nowpage);
    },
    btn2: function (index) {
      layer.close(index);
      $(".nowpage").text(parseInt(nowpage));
      manageQueryData(nowpage); // 组织条件查询
    }
  });
}


/* 设置 */
function sync800Config(obj, id) {
  $("#tempMax_Line").val('');
  $("#tempMin_Line").val('');
  $("#tempMax_Pro").val('');
  $("#tempMin_Pro").val('');
  $("#humdityMax").val('');
  $("#humdityMin").val('');
  $("#leakageCurMax").val('');
  $("#modulus").val('');
  $("#maxRateValue").val('');
  $("#ratioPT").val('');
  $("#ratioCT").val('');
  $("#batteryMin").val('');
  $("#undervoltage").val('');

  var linesOnMasterId = $(obj).attr('dataId');
  var devId = $(obj).attr('dataMonitorFlag'); //设备id就是设备标识
  //        alert(devId)
  if (!devId) {
    layer.msg('同步前请设置母线设备号!', {
      icon: 0,
      time: 30000
    });
    return;
  }
  layer.open({
    type: 1,
    closeBtn: 1,
    title: '同步设置数据到终端',
    // maxmin: true,
    // shadeClose:false, //点击遮罩关闭层
    area: ['500px'],
    content: $('#Sync800Config'),
    btn: ['提交', '取消'],
    yes: function (index, layero) {
      var tempMax_Line = $("#tempMax_Line").val();
      var tempMin_Line = $("#tempMin_Line").val();
      var tempMax_Pro = $("#tempMax_Pro").val();
      var tempMin_Pro = $("#tempMin_Pro").val();
      var humdityMax = $("#humdityMax").val();
      var humdityMin = $("#humdityMin").val();
      var leakageCurMax = $("#leakageCurMax").val();
      var modulus = $("#modulus").val();
      var maxRateValue = $("#maxRateValue").val();
      var ratioPT = $("#ratioPT").val();
      var ratioCT = $("#ratioCT").val();
      var batteryMin = $("#batteryMin").val();
      var undervoltage = $("#undervoltage").val();

      var driveTestFlag_state = $('select[name="driveTestFlag_state"]').val();
      var distanceFlag_state = $('select[name="distanceFlag_state"]').val();
      var data = {
        tempMax_Line: tempMax_Line,
        tempMin_Line: tempMin_Line,
        tempMax_Pro: tempMax_Pro,
        tempMin_Pro: tempMin_Pro,
        humdityMax: humdityMax,
        humdityMin: humdityMin,
        leakageCurMax: leakageCurMax,
        modulus: modulus,
        maxRateValue: maxRateValue,
        ratioPT: ratioPT,
        batteryMin: batteryMin,
        ratioCT: ratioCT,
        undervoltage: undervoltage,
        driveTestFlag: driveTestFlag_state,
        distanceFlag: distanceFlag_state,
        monitorFlag: devId,
        sync_By_linesOnMasterId: linesOnMasterId
      };
      nowpage = $('.nowpage').text();
      addOrUpdateSync800Config(data, nowpage);
      layer.close(index);
      // manageQueryData(nowpage);
    }
  });
}

//保存
function addOrUpdateSync800Config(data) {
  POST("/eric/Sync800Config.v1", data, function (res) {
    if (res.code == '0') {
      console.log(res)
      layer.alert('同步成功！', {
        title: '提示框',
        icon: 1,
      });
    }
  });
}

$(function () {
  // livepreview
  $('body').on('click', '.liveA', function () {
    sessionStorage.pow_ = $(this).data('pow');
    sessionStorage.name_ = $(this).data('name');
  });
})
/** 实时预览 */
function livepreview(x) {
  var _liDom = '';
  x.forEach(y => {
    // 分级
    var kv = '';
    switch (y.hitchType) {
      case '6':
        kv = 'kv6';
        break;
      case '35':
        kv = 'kv35';
        break;
      default:
        kv = 'kv10';
    }
    _liDom += `<li class="momline" data-pre="${y.preMasterName}" data-self="${y.masterName}">
        <span class="pow">${y.hitchType} kV</span><span class="name">${y.masterName}</span><div class="linep ${kv}"></div>
      </li>`;
  });
  $('.live-preview').empty().append(_liDom);
  $('.momline').each(function () {
    // 排序
    var _t = $(this),
      _pre = _t.data('pre');
    _t.before($('.momline[data-self=' + _pre + ']'));
  });
}
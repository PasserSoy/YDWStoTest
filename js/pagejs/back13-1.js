$('#btn-2').click(function () {
  location.href = 'back13_0_line.html?v=1.1.0'
})
layer.config({
  skin: 'layui-layer-molv'
})

var monitorFlag = getPropetyVal('monitorFlag');
var isSolve_ = getPropetyVal('isSolve');
var masterName_ = decodeURI(getPropetyVal('masterName'));
//    alert(masterName_)
var data = {
  page: 1,
  rows: 10,
  isSolve: isSolve_,
  monitorFlag: monitorFlag,
  alarmLeve: 0
};
queryData(data);

function queryData(data) {
  var allCount=0;// 是否有数据
  POST("/eric/getFaultGroundInfoForPageByConditions", data, function (res) {
    if (res.code == '0') {
      var allnum = res.data.count;
      allCount=allnum;// 是否有数据
      var page = Math.ceil(allnum / 10);
      $('.numtotal').text(page);
      $('.numtotalpp').text(allnum);
      var dataList = res.data.list;
      // console.log(dataList)
      $('#tbody').empty();
      $('.ui_input_txt01').attr('max', page);
      $('.ui_input_txt01').val($(".nowpage").text());
      var html = '';
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].phase == '0') {
          dataList[i].phase = "没有相位";
        } else if (dataList[i].phase == '1') {
          dataList[i].phase = "A相";
        } else if (dataList[i].phase == '2') {
          dataList[i].phase = "B相";
        } else if (dataList[i].phase == '4' || dataList[i].phase == '3') {
          dataList[i].phase = "C相";
        };
        if (dataList[i].type == '1') {
          dataList[i].type = "保护器异常";
        } else if (dataList[i].type == '2') {
          dataList[i].type = "过电压故障";
        } else if (dataList[i].type == '3') {
          dataList[i].type = "接地故障";
        };
        /*故障类型*/
        var ftype = Number(dataList[i].faultType);
        var fname = '异常';
        switch (ftype) {
          case 10:
            fname = '金属接地';
            break;
          case 11:
            fname = '系统过电压';
            break;
          case 12:
            fname = '过电压';
            break;
          case 13:
            fname = 'PT断线';
            break;
          case 14:
            fname = '欠压';
            break;
          case 15:
            fname = '系统短路';
            break;
          case 16:
            fname = '弧光接地';
            break;
          default:
            fname = '异常';
        };
        /*报警级别*/
        var aname = '未知级别';
        // if(ftype==10||ftype==11||ftype==12||ftype==13||ftype==14||ftype==15||ftype==16){
        //     aname='高级报警';
        // }else{
        //     aname='异常';
        // }
        aname = dataList[i].alarmLeve;
        var serial = (parseInt($(".nowpage").text()) - 1) * parseInt(10) + parseInt(i) + parseInt(1);
        html += '<tr>' +
          '<td>' + serial + '</td>' +
          '<td>' + dataList[i].masterName + '</td>' +
          '<td>' + dataList[i].masterAddress + '</td>' +
          '<td>' + fname + '</td>' +
          '<td>' + dataList[i].phase + '</td>' +
          '<td>' + dataList[i].times.slice(0, -4) + '</td>' +
          '<td class="td-manage">' +
          '<a dataid = ' + dataList[i].id + ' href="back13_3_FaultEcharts.html?v=1.1.0&autoId=' + dataList[i].autoId+ '&monitorStationName=' + encodeURI(dataList[i].monitorStationName) +
          '&fname=' + encodeURI(fname)+ '&type=' + ftype  + '&masterName=' + encodeURI(dataList[i].masterName) +'&aname=' + encodeURI(aname) +
          '&masterAddress=' + encodeURI(dataList[i].masterAddress) + '&times=' + dataList[i].times.slice(0, -4) + '&devid=' + dataList[
            i].devid + '&monitorFlag=' + monitorFlag + '&isSolve_=' + dataList[i].isSolve_ + '&phase=' + dataList[i].phase +
          '" ' + '>查看</a>' +
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
  }, true);
}

// 组织查询
function manageQueryData(nowpage) {
  data = {
    page: nowpage,
    rows: 10,
    isSolve: isSolve_,
    monitorFlag: monitorFlag,
    alarmLeve: 0
  };
  queryData(data);
}
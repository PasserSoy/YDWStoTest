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
  deviceIds: monitorFlag,
  masterName: masterName_
};
queryData(data);

function queryData(data) {
  POST("/eric/getFaultGroundInfoForPage.v1", data, function (res) {
    if (res.code == '0') {
      var allnum = res.data.count;
      var page = Math.ceil(allnum / 10);
      $('.numtotal').text(page);
      $('.numtotalpp').text(allnum);
      var dataList = res.data.list;
      console.log(dataList)
      $('#tbody').empty();
      $('.ui_input_txt01').attr('max', page);
      $('.ui_input_txt01').val($(".nowpage").text());
      var html = '';
      for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].valueFlag == '0') {
          dataList[i].valueFlag = "没有相位";
        } else if (dataList[i].valueFlag == '1') {
          dataList[i].valueFlag = "A相";
        } else if (dataList[i].valueFlag == '2') {
          dataList[i].valueFlag = "B相";
        } else if (dataList[i].valueFlag == '4') {
          dataList[i].valueFlag = "C相";
        }
        if (dataList[i].type == '1') {
          dataList[i].type = "保护器异常";
        } else if (dataList[i].type == '2') {
          dataList[i].type = "过电压故障";
        } else if (dataList[i].type == '3') {
          dataList[i].type = "接地故障";
        }
        var serial = (parseInt($(".nowpage").text()) - 1) * parseInt(10) + parseInt(i) + parseInt(1);
        html += '<tr>' +
          '<td>' + serial + '</td>' +
          '<td>' + dataList[i].masterName + '</td>' +
          '<td>' + dataList[i].masterAddress + '</td>' +
          '<td>' + dataList[i].type + '</td>' +
          '<td>' + dataList[i].valueFlag + '</td>' +
          '<td>' + dataList[i].times + '</td>' +
          '<td class="td-manage">' +
          '<a dataid = ' + dataList[i].id + ' href="back13_3_FaultEcharts.html?v=1.1.0&autoId=' + dataList[i].autoId +
          '&type=' + encodeURI(dataList[i].type) + '&masterName=' + encodeURI(dataList[i].masterName) +
          '&masterAddress=' + encodeURI(dataList[i].masterAddress) + '&times=' + dataList[i].times + '&devid=' + dataList[
            i].devid + '&monitorFlag=' + monitorFlag + '&isSolve_=' + dataList[i].isSolve_ +
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
    }
  });
}

// 组织查询
function manageQueryData(nowpage) {
  data = {
    page: nowpage,
    rows: 10,
    isSolve: isSolve_,
    deviceIds: monitorFlag,
    masterName: masterName_
  };
  queryData(data);
}
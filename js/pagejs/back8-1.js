var devid = getPropetyVal('devid')

var autoId = getPropetyVal('autoId')

var fname = decodeURI(getPropetyVal('fname'));
var monitorStationName = decodeURI(getPropetyVal('monitorStationName'));
var times = decodeURI(getPropetyVal('times')) + ':000';

$('#fname').text(fname);
$('#monitorStationName').text(monitorStationName);
/*不同的报警类型 图标*/
var type = Number(decodeURI(getPropetyVal('type')));
// alarmType=1 弧光接地、金属接地、过压、欠压、失压、PT断线   alarmType=2 系统过电压
// alarmType=3 过热    alarmType=4 保护器电量不足    alarmType=5 温度传感器电量不足    alarmType=6 过电压保护器故障
var alarmType = 1; /* 报警类型 */
var faultUrl = '/eric/getFaultOverVoltage.v3'; // 折线图请求地址
switch (type) {
  case 10:
    $('.alarmtype i').addClass('Metalground');
    alarmType = 1;
    faultUrl = '/eric/getFaultOverVoltage.v2';
    break; /*金属接地*/
  case 11:
    $('.alarmtype i').addClass('Systemovervoltage');
    alarmType = 2;
    faultUrl = '/eric/getFaultOverVoltage.v2';
    break; /*系统过电压*/
  case 12:
    $('.alarmtype i').addClass('Overpressure');
    alarmType = 1;
    break; /*过电压*/
  case 13:
    $('.alarmtype i').addClass('PTdisconnection');
    alarmType = 1;
    break; /*PT断线*/
  case 14:
    $('.alarmtype i').addClass('Undervoltage');
    alarmType = 1;
    break; /*欠压*/
    // case 15:$('.alarmtype i').addClass('Metalground');break;/*系统短路*/
  case 16:
    $('.alarmtype i').addClass('Loneground');
    alarmType = 1;
    faultUrl = '/eric/getFaultOverVoltage.v2';
    break; /*弧光接地*/
  default:
    $('.alarmtype i').addClass('abnormal'); /*异常*/
};
/*故障信息详情*/
$('.fdetail li.devid .cont').text(getPropetyVal('devid')); /* 设备标识 */
$('.fdetail li.masterName .cont').text(decodeURI(getPropetyVal('masterName'))); /* 母线名称 */
$('.fdetail li.phase .cont').text(decodeURI(getPropetyVal('phase'))); /* 报警–相别 */
$('.fdetail li.times .cont').text(decodeURI(getPropetyVal('times'))); /* 故障时间 */

// 显示故障信息详情
$('.fdetail li').css({
  'visibility': 'visible'
});

/*不同的报警类型对应不同的显示内容 分为6大类*/
$(`[data-atype]:not([data-atype*=${alarmType}])`).hide();


//    autoId = 50;
var data = {
  autoId: autoId,
  deviceId: devid
}
queryFaultGroundInfoList(data);

function queryFaultGroundInfoList(data) {
  POST("/eric/queryFaultGroundInfoList.v1", data, function (res) {
    if (res.code == '0') {
      var dataList = res.data.list;
      var html = '';
      for (var i = 0; i < dataList.length; i++) {
        html += '<li style="border-left:solid 1px #2494f9; position: relative; padding-left: 20px;">' +
          '<span style="width: 10px; height: 10px; display: inline-block; background: #2494f9; border-radius:50%; position: absolute; top: -5px; left: -5px;"></span>' +
          '<label style="WORD-BREAK: break-all; WORD-WRAP: break-word">' + dataList[i].recordMessage + '</label>' +
          '<label>' + dataList[i].createByName + '&nbsp;&nbsp;&nbsp;' + dataList[i].createTime + '</label>' +
          // '<label>'+dataList[i].createTime+'</label>'+
          '</li>';
      }
      $('#FaultGroundInfoList').append(html);
    }
  });
}

// 年月日统计表格
// 横坐标
var _xAxis = [],
  i = 0;
while (i <= 5120) {
  var no = -200 + (i * 400 / 5120);
  _xAxis.push(no);
  i = i + 16;
};
// var xAxis_voltage_name=[-200,-180,-160,-140,-120,-100,-80,-60,-40,-20,0,20,40,60,80,100,120,140,160,180,200];
var xAxis_voltage_name = _xAxis;
var xAxis_Wave_UA = [];
var xAxis_Wave_UB = [];
var xAxis_Wave_UC = [];
var xAxis_Wave_U0 = [];

// var xAxis_Electric_name=[-200,-180,-160,-140,-120,-100,-80,-60,-40,-20,0,20,40,60,80,100,120,140,160,180,200];
var xAxis_Electric_name = _xAxis;
var xAxis_Wave_IA = [];
var xAxis_Wave_IB = [];
var xAxis_Wave_IC = [];
var xAxis_Wave_IX = [];



function getStatisticsData() {
  var data = {
    devid: devid,
    time: times
  };
  xAxis_Wave_UA = [];
  xAxis_Wave_UB = [];
  xAxis_Wave_UC = [];
  xAxis_Wave_U0 = [];

  xAxis_Wave_IA = [];
  xAxis_Wave_IB = [];
  xAxis_Wave_IC = [];
  xAxis_Wave_IX = [];
  POST(faultUrl, data, function (res) { // 故障波形
    if (res.code == '0') {
      var day_Arr = res.data;
      // 绑定有效值
      for (var i in day_Arr) {
        if (i.indexOf('val') > -1) {
          var val = 0;
          if (Array.isArray(day_Arr[i])) {
            var val = day_Arr[i][1].toFixed(2) == 0 ? 0 : day_Arr[i][1].toFixed(2);
          } else {
            var val = day_Arr[i].toFixed(2) == 0 ? 0 : day_Arr[i].toFixed(2);
          }
          $(`.valid span.${i}`).text(val);
        }
      }
      if (day_Arr != null) { // 数组存在
        var j = 0;
        while (j < 5120) {
          var _UA = day_Arr.wave_UA[j];
          xAxis_Wave_UA.push(_UA); // A相电压
          var _UB = day_Arr.wave_UB[j];
          xAxis_Wave_UB.push(_UB); // B相电压
          var _UC = day_Arr.wave_UC[j];
          xAxis_Wave_UC.push(_UC); // C相电压
          var _U0 = day_Arr.wave_U0[j];
          xAxis_Wave_U0.push(_U0); // U相电压

          var _IA = day_Arr.wave_IA[j];
          xAxis_Wave_IA.push(_IA); // A相电流
          var _IB = day_Arr.wave_IB[j];
          xAxis_Wave_IB.push(_IB); // B相电流
          var _IC = day_Arr.wave_IC[j];
          xAxis_Wave_IC.push(_IC); // C相电流
          var _IX = day_Arr.wave_IX[j];
          xAxis_Wave_IX.push(_IX); // I相电流
          j = j + 16;
        };
        Statistics_btn(xAxis_Wave_UA, xAxis_Wave_UB, xAxis_Wave_UC, xAxis_Wave_U0, xAxis_Wave_IA, xAxis_Wave_IB, xAxis_Wave_IC, xAxis_Wave_IX);
      }
    };
  }, function () {
    $('.loadjy').addClass('op');
  }, function () {
    $('.loadjy').removeClass('op');
    callB = true;
  }, true);
}



getStatisticsData();
var myChart_mains_one = echarts.init(document.getElementById('mains_one'));
var myChart_mains_two = echarts.init(document.getElementById('mains_two'));
var myChart_mains_one_1 = echarts.init(document.getElementById('mains_one_1'));
var myChart_mains_two_1 = echarts.init(document.getElementById('mains_two_1'));

function Statistics_btn(xAxis_Wave_UA, xAxis_Wave_UB, xAxis_Wave_UC, xAxis_Wave_U0, xAxis_Wave_IA, xAxis_Wave_IB, xAxis_Wave_IC, xAxis_Wave_IX) {
  // 电压波形
  option_one = {
    color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
    title: {
      text: '电压波形',
      x: '20',
      y: '0'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var text = `<p class="date"><i>时间: </i><em>${params[0].name} ms</em></p>`;
        for (var x of params) {
          var val = 0;
          if (String(x.value / 1000).indexOf('.') > -1) {
            val = (x.value / 1000).toFixed(2) != 0 ? (x.value / 1000).toFixed(2) : 0;
          } else {
            val = x.value / 1000;
          };
          text += `<p><span style="background-color:${x.color}"></span><i>${x.seriesName}: </i><em>${val} kV</em></p>`
        };
        text = `<div class="echartData">${text}</div>`;
        return text;
      }
    },
    legend: {
      data: ['A相电压', 'B相电压', 'C相电压'],
      x: '20px',
      y: '30px'
    },
    grid: {
      left: 80,
      right: 25,
      bottom: 30,
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      name: ' 时间(ms)',
      nameLocation: 'start',
      boundaryGap: false,
      axisLabel: {
        interval: 15,
        showMaxLabel: true
      },
      data: xAxis_voltage_name
    },
    yAxis: {
      show: true,
      name: ' 电压(kV)',
      nameLocation: 'end',
      type: 'value',
      position: 'right',
      axisLabel: {
        formatter: function (v) {
          return v / 1000 + ' kV'
        }
      }
    },
    dataZoom: [{
      // type: 'inside',
      show: true,
      start: 0,
      end: 100
    }],
    series: [{
        name: 'A相电压',
        type: 'line',
        //                    clickable:true,
        symbolSize: 3,
        data: xAxis_Wave_UA,
        smooth: true
      },
      {
        name: 'B相电压',
        type: 'line',
        data: xAxis_Wave_UB,
        smooth: true
      },
      {
        name: 'C相电压',
        type: 'line',
        data: xAxis_Wave_UC,
        smooth: true
      }
    ]
  };
  myChart_mains_one.setOption(option_one);
  // 3U0波形
  option_one_1 = {
    color: ['#333'],
    title: {
      text: '3U0波形',
      x: '20',
      y: '0'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var text = `<p class="date"><i>时间: </i><em>${params[0].name} ms</em></p>`;
        for (var x of params) {
          var val = 0;
          if (String(x.value).indexOf('.') > -1) {
            val = (x.value).toFixed(2) != 0 ? (x.value).toFixed(2) : 0;
          } else {
            val = x.value;
          };
          text += `<p><span style="background-color:${x.color}"></span><i>${x.seriesName}: </i><em>${val} V</em></p>`
        };
        text = `<div class="echartData">${text}</div>`;
        return text;
      }
    },
    legend: {
      data: ['3U0电压'],
      x: '20px',
      y: '30px'
    },
    grid: {
      left: '80',
      right: '25',
      bottom: '30',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      name: ' 时间(ms)',
      nameLocation: 'start',
      boundaryGap: false,
      axisLabel: {
        interval: 15,
        showMaxLabel: true
      },
      data: xAxis_voltage_name
    },
    yAxis: {
      show: true,
      name: ' 电压(V)',
      nameLocation: 'end',
      type: 'value',
      position: 'right',
      axisLabel: {
        formatter: function (v) {
          return v + ' V'
        }
      }
    },
    dataZoom: [{
      show: true,
      start: 10,
      end: 50
    }],
    series: [{
      name: '3U0电压',
      type: 'line',
      data: xAxis_Wave_U0,
      smooth: true
    }]
  };
  myChart_mains_one_1.setOption(option_one_1);
  // 电流波形
  option_two = {
    color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
    title: {
      text: '电流波形',
      x: '20',
      y: '0'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var text = `<p class="date"><i>时间: </i><em>${params[0].name} ms</em></p>`;
        for (var x of params) {
          var val = 0;
          if (String(x.value).indexOf('.') > -1) {
            val = (x.value).toFixed(2) != 0 ? (x.value).toFixed(2) : 0;
          } else {
            val = x.value;
          };
          text += `<p><span style="background-color:${x.color}"></span><i>${x.seriesName}: </i><em>${val} A</em></p>`
        };
        text = `<div class="echartData">${text}</div>`;
        return text;
      }
    },
    legend: {
      data: ['A相电流', 'B相电流', 'C相电流'],
      x: '20px',
      y: '30px'
    },
    grid: {
      left: '80',
      right: '25',
      bottom: '30',
      containLabel: true
    },
    // toolbox: {
    //     feature: {
    //         saveAsImage: {}
    //     }
    // },
    xAxis: {
      type: 'category',
      name: ' 时间(ms)',
      nameLocation: 'start',
      boundaryGap: false,
      axisLabel: {
        interval: 15,
        showMaxLabel: true
      },
      data: xAxis_Electric_name
    },
    yAxis: {
      show: true,
      name: ' 电流(A)',
      nameLocation: 'end',
      type: 'value',
      position: 'right',
      axisLabel: {
        formatter: '{value} A'
      }
    },
    dataZoom: [{
      show: true,
      start: 0,
      end: 100
    }],
    series: [{
        name: 'A相电流',
        type: 'line',
        smooth: true,
        symbolSize: 3,
        data: xAxis_Wave_IA
      },
      {
        name: 'B相电流',
        type: 'line',
        smooth: true,
        data: xAxis_Wave_IB
      },
      {
        name: 'C相电流',
        type: 'line',
        smooth: true,
        data: xAxis_Wave_IC
      }
    ]
  };
  myChart_mains_two.setOption(option_two);
  // 3I0波形
  option_two_1 = {
    color: ['#333'],
    title: {
      text: '3I0波形',
      x: '20',
      y: '0'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        var text = `<p class="date"><i>时间: </i><em>${params[0].name} ms</em></p>`;
        for (var x of params) {
          var val = 0;
          if (String(x.value).indexOf('.') > -1) {
            val = (x.value).toFixed(2) != 0 ? (x.value).toFixed(2) : 0;
          } else {
            val = x.value;
          };
          text += `<p><span style="background-color:${x.color}"></span><i>${x.seriesName}: </i><em>${val} A</em></p>`
        };
        text = `<div class="echartData">${text}</div>`;
        return text;
      }
    },
    legend: {
      data: ['3I0电流'],
      x: '20px',
      y: '30px'
    },
    grid: {
      left: '80',
      right: '25',
      bottom: '30',
      containLabel: true
    },
    // toolbox: {
    //     feature: {
    //         saveAsImage: {}
    //     }
    // },
    xAxis: {
      type: 'category',
      name: ' 时间(ms)',
      nameLocation: 'start',
      boundaryGap: false,
      axisLabel: {
        interval: 15,
        showMaxLabel: true
      },
      data: xAxis_Electric_name
    },
    yAxis: {
      show: true,
      name: ' 电流(A)',
      nameLocation: 'end',
      type: 'value',
      position: 'right',
      axisLabel: {
        formatter: '{value} A'
      }
    },
    dataZoom: [{
      show: true,
      start: 0,
      end: 100
    }],
    series: [{
      name: '3I0电流',
      type: 'line',
      smooth: true,
      data: xAxis_Wave_IX
    }]
  };
  myChart_mains_two_1.setOption(option_two_1);
}


$(function () {
  myChart_mains_one.resize();
  myChart_mains_one_1.resize();
  myChart_mains_two.resize();
  myChart_mains_two_1.resize();
  $(window).resize(function () {
    myChart_mains_one.resize();
    myChart_mains_one_1.resize();
    myChart_mains_two.resize();
    myChart_mains_two_1.resize();
  })
})
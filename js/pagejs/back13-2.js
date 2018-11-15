var mydate_new = new Date(); //通过new方法创建对象
timeStart = mydate_new.getFullYear() + '-' + (mydate_new.getMonth() + 1) + '-' + mydate_new.getDate() + ' 00:00:00:000';
timeEnd = mydate_new.getFullYear() + '-' + (mydate_new.getMonth() + 1) + '-' + mydate_new.getDate() + ' 23:59:59:000';

var myChart_mains_temp = echarts.init(document.getElementById('mains_temp'));
var myChart_mains_humidity = echarts.init(document.getElementById('mains_humidity'));
var myChart_mains_leakElec = echarts.init(document.getElementById('mains_leakElec'));
var myChart_mains_acionCount = echarts.init(document.getElementById('mains_acionCount'));
var myChart_mains_newtemper = echarts.init(document.getElementById('mains_newtemper'));

$('#btn-2').on('click', function () {
  // window.parent.$("#iframepage").attr("src",'back13_0_line.html');
  window.history.back(-1);
})

/*温度采集器*/
$('#newtemper').click(function () {
  myChart_mains_newtemper.clear();
  Statistics_btn('newtemper'); // 展示图表
  $('#newtemper').addClass('color_action');
  /*隐藏div图表*/
  $(this).show(0).siblings().hide(0);
  $('#mains_newtemper').removeClass('none');
  $('#mains_temp').addClass('none');
  $('#mains_humidity').addClass('none');
  $('#mains_leakElec').addClass('none');
  $('#mains_acionCount').addClass('none');
  organizationData('newtemper', sessionStorage.monitorFlag, timeStart, timeEnd); //  获取温度采集器的温度波形
})

$('#temp').click(function () {
  myChart_mains_temp.clear();
  $('#temp').addClass('color_action');
  $('#humidity').removeClass('color_action');
  $('#leakElec').removeClass('color_action');
  $('#acionCount').removeClass('color_action');
  
  /*隐藏div图表*/
  $(this).show(0).siblings().show(0);
  $('#newtemper').hide(0);
  $('#mains_temp').removeClass('none');
  $('#mains_humidity').addClass('none');
  $('#mains_leakElec').addClass('none');
  $('#mains_acionCount').addClass('none');
  $('#mains_newtemper').addClass('none');
  organizationData('temp', sessionStorage.monitorFlag, timeStart, timeEnd); //  获取过电压保护器的温度
  Statistics_btn('temp'); // 展示图表
})

$('#humidity').click(function () {
  myChart_mains_humidity.clear();
  $('#humidity').addClass('color_action');
  $('#temp').removeClass('color_action');
  $('#leakElec').removeClass('color_action');
  $('#acionCount').removeClass('color_action');
  
  /*隐藏div图表*/
  $('#mains_temp').addClass('none');
  $('#mains_humidity').removeClass('none');
  $('#mains_leakElec').addClass('none');
  $('#mains_acionCount').addClass('none');
  organizationData('humidity', sessionStorage.monitorFlag, timeStart, timeEnd); // 获取过电压保护器的湿度
  Statistics_btn('humidity'); // 展示图表
})



$('#leakElec').click(function () {
  myChart_mains_leakElec.clear();
  $('#leakElec').addClass('color_action');
  $('#temp').removeClass('color_action');
  $('#humidity').removeClass('color_action');
  $('#acionCount').removeClass('color_action');
  
  /*隐藏div图表*/
  $('#mains_temp').addClass('none');
  $('#mains_humidity').addClass('none');
  $('#mains_leakElec').removeClass('none');
  $('#mains_acionCount').addClass('none');
  
  organizationData('leakElec', sessionStorage.monitorFlag, timeStart, timeEnd); // 查询保护器泄漏电流
  Statistics_btn('leakElec'); // 展示图表
})
$('#acionCount').click(function () {
  myChart_mains_acionCount.clear();
  $('#acionCount').addClass('color_action');
  $('#temp').removeClass('color_action');
  $('#humidity').removeClass('color_action');
  $('#leakElec').removeClass('color_action');
  
  /*隐藏div图表*/
  $('#mains_temp').addClass('none');
  $('#mains_humidity').addClass('none');
  $('#mains_leakElec').addClass('none');
  $('#mains_acionCount').removeClass('none');
  organizationData('acionCount', sessionStorage.monitorFlag, timeStart, timeEnd); // 查询保护器泄漏电流
  Statistics_btn('acionCount'); // 展示图表
})




function manageQueryData() {}

// 查询时间数据,不存在则默认当天0点到24点,
var timeStart;
var timeEnd;

// 获取过电压保护器的湿度
var xAxis_time_name = []; // 时间戳

var series_temper_a = []; // A相温度；
var series_temper_b = []; // B相温度
var series_temper_c = []; // C相温度

var series_humidity_a = []; // A相湿度；
var series_humidity_b = []; // B相湿度
var series_humidity_c = []; // C相湿度

// 保护器泄漏电流
var series_leakElec_value = [];
// 所有相位动作次数
var series_acionCount_value = [];
// 温度
var series_newtemper_value = [];

function organizationData(index, monitorFlag, timeStart, timeEnd) {
  var data = {
    sensorId: monitorFlag,
    timeStart: timeStart,
    timeEnd: timeEnd
  };
  if (index == 'temp') { // 获取过电压保护器的温度
    xAxis_time_name = [];
    series_temper_a = [];
    series_temper_b = [];
    series_temper_c = [];

    POST("/eric/getTemperatureForVoltage.v1", data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        for (var i = 0; i < day_Arr.length; i++) {
          xAxis_time_name.push(day_Arr[i].time);
          //                        xAxis_time_name.push(i);
          series_temper_a.push(day_Arr[i].temper_a);
          series_temper_b.push(day_Arr[i].temper_b);
          series_temper_c.push(day_Arr[i].temper_c);
        }
      }
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'humidity') { // 获取过电压保护器的湿度
    xAxis_time_name = [];
    series_humidity_a = [];
    series_humidity_b = [];
    series_humidity_c = [];
    POST("/eric/gethumidityForVoltage.v1", data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        for (var i = 0; i < day_Arr.length; i++) {
          xAxis_time_name.push(day_Arr[i].time);
          series_humidity_a.push(day_Arr[i].humidity_a);
          series_humidity_b.push(day_Arr[i].humidity_b);
          series_humidity_c.push(day_Arr[i].humidity_c);
        }
      }
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'leakElec') { // 查询保护器泄漏电流
    xAxis_time_name = [];
    series_leakElec_value = [];
    POST("/eric/getLeakElecForId.v1", data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        for (var i = 0; i < day_Arr.length; i++) {
          xAxis_time_name.push(day_Arr[i].time);
          series_leakElec_value.push(day_Arr[i].electric);
        }
      }
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'acionCount') { // 获取保护器的所有相位动作次数
    xAxis_time_name = [];
    series_acionCount_value = [];
    POST("/eric/getAcionCountForValue.v1", data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        for (var i = 0; i < day_Arr.length; i++) {
          xAxis_time_name.push(day_Arr[i].valueflag_value);
          series_acionCount_value.push(day_Arr[i].count);
        }
      }
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'newtemper') { // 获取温度采集器
    xAxis_time_name = [];
    series_newtemper_value = [];
    var data = {
      monitorFlag: monitorFlag,
      timeStart: timeStart,
      timeEnd: timeEnd
    };
    POST("/eric/getTemper_data.v1", data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        for (var i = 0; i < day_Arr.length; i++) {
          var _time = new Date(parseInt(day_Arr[i].timestamp)).toLocaleString('chinese', {
            hour12: false
          }).replace(/\//g, '-');
          var _val = (day_Arr[i].temper - 500) / 10;
          xAxis_time_name.push(_time);
          series_newtemper_value.push(_val);
        }
        // console.log('xAxis_time_name')
        // console.log(xAxis_time_name)
        // console.log('series_newtemper_value')
        // console.log(series_newtemper_value)
      }
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  }


}



function Statistics_btn(index) {
  if (index == 'temp') {
    option_one = {
      color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
      title: {
        text: '温度',
        x: '20',
        y: '0'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        x: 20,
        y: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xAxis_time_name
      },
      yAxis: {
        show: true,
        name: '温度(℃)',
        nameLocation: 'end',
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: '{value} ℃'
        }
      },
      series: [{
          name: 'A相温度',
          type: 'line',
          data: series_temper_a
        },
        {
          name: 'B相温度',
          type: 'line',
          data: series_temper_b
        },
        {
          name: 'C相温度',
          type: 'line',
          data: series_temper_c
        }

      ]
    };
    myChart_mains_temp.resize();
    myChart_mains_temp.setOption(option_one);
  } else if (index == 'humidity') {
    option_one = {
      color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
      title: {
        text: '湿度',
        x: '20',
        y: '0'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
      },
      legend: {
        x: '20px',
        y: '30px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xAxis_time_name
      },
      yAxis: {
        show: true,
        name: '湿度(%RH)',
        nameLocation: 'end',
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: '{value} %RH'
        }
      },
      series: [{
          name: 'A相湿度',
          type: 'line',
          data: series_humidity_a
        },
        {
          name: 'B相湿度',
          type: 'line',
          data: series_humidity_b
        },
        {
          name: 'C相湿度',
          type: 'line',
          data: series_humidity_c
        }

      ]
    };
    myChart_mains_humidity.resize();
    myChart_mains_humidity.setOption(option_one);
  } else if (index == 'leakElec') {
    option_one = {
      color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
      title: {
        text: '泄漏电流',
        x: '20',
        y: '0'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xAxis_time_name
      },
      yAxis: {
        show: true,
        name: '电流(μA)',
        nameLocation: 'end',
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: '{value} A'
        }
      },
      series: [{
        name: '电流值',
        type: 'line',
        data: series_leakElec_value
      }]
    };
    myChart_mains_leakElec.resize();
    myChart_mains_leakElec.setOption(option_one);
  } else if (index == 'acionCount') {
    option_one = {
      color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
      title: {
        text: '相位动作次数',
        x: '20',
        y: '0'
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xAxis_time_name
      },
      yAxis: {
        show: true,
        name: '动作次数',
        nameLocation: 'end',
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: '{value} 次数'
        }
      },
      series: [{
        name: '动作次数',
        type: 'bar',
        barMaxWidth: '50',
        data: series_acionCount_value,
        //设置柱体颜色
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = ['#FB1734', '#14AE68', '#FFCD2D'];
              return colorList[params.dataIndex]
            },
          }
        },
      }]
    };
    myChart_mains_acionCount.resize();
    myChart_mains_acionCount.setOption(option_one);
  } else if (index == 'newtemper') {
    option_one = {
      color: ['#FFCD2D', '#14AE68', '#FB1734', '#333'],
      title: {
        text: '温度',
        x: '20',
        y: '0'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xAxis_time_name
      },
      yAxis: {
        show: true,
        name: '温度(℃)',
        nameLocation: 'end',
        type: 'value',
        position: 'right',
        axisLabel: {
          formatter: '{value} ℃'
        }
      },
      series: [{
        name: '温度',
        type: 'line',
        data: series_newtemper_value
      }]
    };
    myChart_mains_newtemper.resize();
    myChart_mains_newtemper.setOption(option_one);
  }

}
var id = getPropetyVal('id');

POST('/sys/linesOnBranch/queryLinesOnBranchBySelect.v1', {
  linesOnBranchId: id
}, function (res) {
  // console.log(res.data)
  if (res.code == 0) {
    var tpl = ''
    for (let i = 0; i < res.data.length; i++) {
      if (i == 0) {
        var a = res.data[i].monitorFlag;
        sessionStorage.monitorFlag = a;
        init(a);
        /* 判断监测设备类型
        hitchType=温度采集器||过电压保护器
        */
        var _t = res.data[i].hitchType;
        if (_t == '温度采集器') {
          // alert('这是温度采集器')
          $('.showData #newtemper').click();
        } else {
          // alert('这是过电压保护器')
          $('.showData #temp').click();
        }
      }
      tpl += '<option data-type="' + res.data[i].hitchType + '" value="' + res.data[i].monitorFlag + '">' + res.data[i].pointName + '</option>';
    }
    $('#monitorPoint').append(tpl);

    $('#monitorPoint').change(function () {
      var a = $('#monitorPoint option:selected').val();
      sessionStorage.monitorFlag = a;
      //            alert(a);
      init(a);
      /* 判断监测设备类型
      hitchType=温度采集器||过电压保护器
      */
      var _t = $('#monitorPoint  option:selected').data('type');
      if (_t == '温度采集器') {
        // alert('这是温度采集器')
        $('.showData #newtemper').click();
      } else {
        // alert('这是过电压保护器')
        $('.showData #temp').click();
      }
    })
  }else{
    sessionStorage.monitorFlag='null';
    $('.loadjy').removeClass('op');
    init(sessionStorage.monitorFlag);
  };
}, function () {
  $('.loadjy').addClass('op');
});


function init(monitorFlag) {
  sessionStorage.monitorFlag = monitorFlag;
  var mydate = new Date(); //通过new方法创建对象
  if ($('#timeStart').val()) {
    timeStart = $('#timeStart').val() + ' 00:00:00:000';
  } else {
    // timeStart = '1970-01-01 00:00:00:000';
    timeStart = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate() + ' 00:00:00:000';
  }
  if ($('#timeEnd').val()) {
    timeEnd = $('#timeEnd').val() + ' 23:59:59:000';
  } else {
    //            timeEnd = '2018-06-26 01:00:00:000';
    timeEnd = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate() + ' 23:59:59:000';
  }

  // 第一次进来执行温度波形 初始化  organizationData
  // organizationData('temp',monitorFlag,timeStart,timeEnd);//  获取过电压保护器的温度波形
  // Statistics_btn('temp');// 展示图表

  //   $('#temp').addClass('color_action');
  // $('#humidity').removeClass('color_action');
  // $('#leakElec').removeClass('color_action');
  // $('#acionCount').removeClass('color_action');

  // /*隐藏div图表*/
  // $('#mains_temp').removeClass('none');
  // $('#mains_humidity').addClass('none');
  // $('#mains_leakElec').addClass('none');
  // $('#mains_acionCount').addClass('none');
  var _t = $('#monitorPoint  option:selected').data('type');
  if (_t == '温度采集器') {
    // alert('这是温度采集器')
    $('.showData #newtemper').click();
  } else {
    // alert('这是过电压保护器')
    $('.showData #temp').click();
  }
}

$('#btn-2').click(function () {
  location.href = 'back13_0_line.html?v=1.1.0'
})

$(function(){
  // resize
  $(window).resize(function () {
    myChart_mains_temp.resize();
    myChart_mains_humidity.resize();
    myChart_mains_leakElec.resize();
    myChart_mains_acionCount.resize();
    myChart_mains_newtemper.resize();
  })
})
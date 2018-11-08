// 默认点击第一个
sessionStorage.tabID = 'eric';
// 波形图初始化
var myChart_mains_temp = echarts.init(document.getElementById('mains_temp'));
var myChart_mains_humidity = echarts.init(document.getElementById('mains_humidity'));
var myChart_mains_leakElec = echarts.init(document.getElementById('mains_leakElec'));
var myChart_mains_acionCount = echarts.init(document.getElementById('mains_acionCount'));
var myChart_mains_newtemper = echarts.init(document.getElementById('mains_newtemper'));

var nullDataDom = '<p class="nullData"><i>查询数据为空...</i></p>'; /*查询数据为空时的dom结构*/
var mydate = new Date(); //通过new方法创建对象
var timeStart;
var timeEnd; //通过new方法创建对象
var mydate = new Date(); //通过new方法创建对象
var _year = mydate.getFullYear();
var _month = (mydate.getMonth() + 1) < 10 ? '0' + (mydate.getMonth() + 1) : mydate.getMonth() + 1;
var _date = mydate.getDate() < 10 ? '0' + mydate.getDate() : mydate.getDate();
var _mydate = _year + '-' + _month + '-' + _date;
if ($('#timeStart').val()) {
  timeStart = $('#timeStart').val() + ' 00:00:00:000';
} else {
  //            timeStart = '1970-01-01 00:00:00:000';
  $('#timeStart').val(_mydate);
  timeStart = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate() + ' 00:00:00:000';
}
if ($('#timeEnd').val()) {
  timeEnd = $('#timeEnd').val() + ' 23:59:59:000';
} else {
  //            timeEnd = '2018-06-26 01:00:00:000';
  $('#timeEnd').val(_mydate);
  timeEnd = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate() + ' 23:59:59:000';
}

/*温度采集器*/
$('#newtemper').click(function () {
  myChart_mains_newtemper.clear();
  $('#newtemper').addClass('color_action');
  /*隐藏div图表*/
  $(this).show(0).siblings().hide(0);
  $('#mains_newtemper').removeClass('none');
  $('#mains_temp').addClass('none');
  $('#mains_humidity').addClass('none');
  $('#mains_leakElec').addClass('none');
  $('#mains_acionCount').addClass('none');
  // myChart_mains_newtemper.showLoading();
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
  // myChart_mains_temp.showLoading();
  organizationData('temp', sessionStorage.monitorFlag, timeStart, timeEnd); //  获取温度采集器的温度波形
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
  // myChart_mains_humidity.showLoading();
  organizationData('humidity', sessionStorage.monitorFlag, timeStart, timeEnd); // 获取过电压保护器的湿度波形
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
  // myChart_mains_leakElec.showLoading();
  organizationData('leakElec', sessionStorage.monitorFlag, timeStart, timeEnd); // 查询保护器泄漏电流波形

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
  //  myChart_mains_acionCount.showLoading();
  organizationData('acionCount', sessionStorage.monitorFlag, timeStart, timeEnd); // 查询保护器泄漏电流波形
})


$('#btn-1').on('click', function () {
  window.parent.$("#iframepage").attr("src", 'back9_1_DailyMasterInfo.html?v=1.0.0');
})

/*用户-查询*/
$('.btn_search').bind('click', function (e) {
  init(sessionStorage.monitorFlag)
});

function manageQueryData() {}

// 查询时间数据,不存在则默认当天0点到24点,
var timeStart;
var timeEnd;

// 获取过电压保护器的湿度波形
var xAxis_time_name = []; // 时间戳

var series_temper_a = []; // A相温度；
var series_temper_b = []; // B相温度
var series_temper_c = []; // C相温度

var series_humidity_a = []; // A相湿度；
var series_humidity_b = []; // B相湿度
var series_humidity_c = []; // C相湿度

// 保护器泄漏电流波形
var series_leakElec_value = [];
// 所有相位动作次数
var series_acionCount_value = [];

//    organizationData('acionCount','B11');// 获取保护器的所有相位动作次数




function organizationData(index, monitorFlag, timeStart, timeEnd) {
  $('.nullData').remove();
  var data = {
    sensorId: monitorFlag,
    timeStart: timeStart,
    timeEnd: timeEnd
  };
  data.token = sessionStorage.token;
  if (index == 'temp') { // 获取过电压保护器的温度波形
    //            var data = {sensorId:sessionStorage.monitorFlag,timeStart:'1970-01-01 00:00:00:000',timeEnd:'2018-05-26 01:00:00:000'};
    xAxis_time_name = [];
    series_temper_a = [];
    series_temper_b = [];
    series_temper_c = [];
    POST('/eric/getTemperatureForVoltage.v1', data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        if (day_Arr.length <= 0) {
          $('#mains_temp').append(nullDataDom);
        } else {
          for (var i = 0; i < day_Arr.length; i++) {
            xAxis_time_name.push(day_Arr[i].time);
            series_temper_a.push(day_Arr[i].temper_a.toFixed(2));
            series_temper_b.push(day_Arr[i].temper_b.toFixed(2));
            series_temper_c.push(day_Arr[i].temper_c.toFixed(2));
          }
        };
        Statistics_btn('temp'); // 展示图表
        myChart_mains_temp.hideLoading();
      };
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'humidity') { // 获取过电压保护器的湿度波形
    xAxis_time_name = [];
    series_humidity_a = [];
    series_humidity_b = [];
    series_humidity_c = [];
    POST('/eric/gethumidityForVoltage.v1', data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        if (day_Arr.length <= 0) {
          $('#mains_humidity').append(nullDataDom);
        } else {
          for (var i = 0; i < day_Arr.length; i++) {
            xAxis_time_name.push(day_Arr[i].time);
            series_humidity_a.push(day_Arr[i].humidity_a.toFixed(2));
            series_humidity_b.push(day_Arr[i].humidity_b.toFixed(2));
            series_humidity_c.push(day_Arr[i].humidity_c.toFixed(2));
          }
        };
        Statistics_btn('humidity'); // 展示图表
        myChart_mains_humidity.hideLoading();
      };
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'leakElec') { // 查询保护器泄漏电流波形
    xAxis_time_name = [];
    series_leakElec_value = [];
    POST('/eric/getLeakElecForId.v1', data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        if (day_Arr.length <= 0) {
          $('#mains_leakElec').append(nullDataDom);
        } else {
          for (var i = 0; i < day_Arr.length; i++) {
            xAxis_time_name.push(day_Arr[i].time);
            series_leakElec_value.push(day_Arr[i].electric.toFixed(2));
          }
        };
        Statistics_btn('leakElec'); // 展示图表
        myChart_mains_leakElec.hideLoading();
      };
    }, function () {
      $('.loadjy').addClass('op');
    }, function () {
      $('.loadjy').removeClass('op');
    }, true);
  } else if (index == 'acionCount') { // 获取保护器的所有相位动作次数
    xAxis_time_name = [];
    series_acionCount_value = [];
    POST('/eric/getAcionCountForValue.v1', data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        if (day_Arr.length <= 0) {
          $('#mains_acionCount').append(nullDataDom);
        } else {
          for (var i = 0; i < day_Arr.length; i++) {
            xAxis_time_name.push(day_Arr[i].valueflag_value);
            series_acionCount_value.push(day_Arr[i].count);
          }
        };
        Statistics_btn('acionCount'); // 展示图表
        myChart_mains_acionCount.hideLoading();
      };
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
    POST('/eric/getTemper_data.v1', data, function (res) {
      if (res.code == '0') {
        var day_Arr = res.data;
        if (day_Arr.length <= 0) {
          $('#mains_newtemper').append(nullDataDom);
        } else {
          for (var i = 0; i < day_Arr.length; i++) {
            var _time = new Date(parseInt(day_Arr[i].timestamp)).toLocaleString('chinese', {
              hour12: false
            }).replace(/\//g, '-');
            var _val = (day_Arr[i].temper - 500) / 10;
            xAxis_time_name.push(_time);
            series_newtemper_value.push(_val.toFixed(2));
          }
        };
        Statistics_btn('newtemper'); // 展示图表
        myChart_mains_newtemper.hideLoading();
      };
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
        data: ['A相温度', 'B相温度', 'C相温度'],
        x: '20px',
        y: '30px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLabel: {
          formatter: function (val) {
            return val.replace(/\s/gi, '\n');
          }
        },
        axisTick: {
          alignWithLabel: true
        },
        //                                axisLabel: {
        //                                    textStyle:{
        //                                        fontWeight:"bolder",
        //                                        color:"#000000"
        //                                    },
        //                                    //X轴刻度配置
        //                                    interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
        //                                },
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
    myChart_mains_temp.clear();
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
        data: ['A相湿度', 'B相湿度', 'C相湿度'],
        x: '20px',
        y: '30px'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLabel: {
          formatter: function (val) {
            return val.replace(/\s/gi, '\n');
          }
        },
        axisTick: {
          alignWithLabel: true
        },
        //                                axisLabel: {
        //                                    textStyle:{
        //                                        fontWeight:"bolder",
        //                                        color:"#000000"
        //                                    },
        //                                    //X轴刻度配置
        //                                    interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
        //                                },
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
    myChart_mains_humidity.clear();
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
      toolbox: {
        feature: {
          saveAsImage: {}
        }
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
          formatter: '{value} μA'
        }
      },
      series: [{
        name: '电流值',
        type: 'line',
        data: series_leakElec_value
      }]
    };
    myChart_mains_leakElec.clear();
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
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLabel: {
          formatter: function (val) {
            return val.replace(/\s/gi, '\n');
          }
        },
        axisTick: {
          alignWithLabel: true
        },
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
    myChart_mains_acionCount.clear();
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
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisLabel: {
          formatter: function (val) {
            return val.replace(/\s/gi, '\n');
          }
        },
        axisTick: {
          alignWithLabel: true
        },
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
    myChart_mains_newtemper.clear();
    myChart_mains_newtemper.setOption(option_one);
  }

}



// 五级联动
POST('/sys/company/queryStaticThree.v1', {
  type: '5',
  createBy: sessionStorage.id
}, function (res) {
  //    console.log(res.data)
  if (res.code == 0) {
    var tpl1 = '';
    var tpl2 = '';
    var tpl3 = '';
    var tpl4 = '';
    var tpl5 = '';
    var x, y, z, m, n;
    var k = 0;
    var j = 0;
    var l = 0;
    var h = 0;
    sessionStorage.monitorFlag = 'null';
    for (var i = 0; i < res.data.length; i++) {
      tpl1 += '<option value="' + i + '">' + res.data[i].companyName + '</option>';

    }
    if (res.data[0] != undefined) {
      for (let i of res.data[0].monitorStationDtos) {
        tpl2 += '<option value="' + k + '">' + i.stationName + '</option>';
        k++;
      };
      if (res.data[0].monitorStationDtos[0] != undefined) {
        for (let i of res.data[0].monitorStationDtos[0].linesOnMasterSortList) {
          tpl3 += '<option value="' + j + '">' + i.masterName + '</option>';
          j++
        };
        if (res.data[0].monitorStationDtos[0].linesOnMasterSortList[0] != undefined) {
          for (let i of res.data[0].monitorStationDtos[0].linesOnMasterSortList[0].linesOnBranchDtos) {
            tpl4 += '<option value="' + l + '">' + i.branchName + '</option>';
            l++
          };
          if (res.data[0].monitorStationDtos[0].linesOnMasterSortList[0].linesOnBranchDtos[0] != undefined) {
            for (let i of res.data[0].monitorStationDtos[0].linesOnMasterSortList[0].linesOnBranchDtos[0].monitorPointDtos) {
              if (h == 0) {
                sessionStorage.monitorFlag = i.monitorFlag;
              };
              tpl5 += '<option data-type="' + i.hitchType + '" value="' + h + '">' + i.pointName + '</option>';
              h++
            };
          };
        };
      };
    };
    $('#company').append(tpl1);
    $('#site').append(tpl2);
    $('#generatrix').append(tpl3);
    $('#linesOnBranch').append(tpl4);
    $('#monitorPoint').append(tpl5);

    //  init(sessionStorage.monitorFlag)
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


    $('#company').change(function () {
      tpl2 = '';
      tpl3 = '';
      tpl4 = '';
      tpl5 = '';
      k = 0;
      j = 0;
      l = 0;
      h = 0;
      $('#site').empty();
      $('#generatrix').empty();
      $('#linesOnBranch').empty();
      $('#monitorPoint').empty();
      x = $('#company  option:selected').val();
      parseInt(x);
      sessionStorage.monitorFlag = 'null';
      for (let j of res.data[x].monitorStationDtos) {
        tpl2 += '<option value="' + k + '">' + j.stationName + '</option>';
        k++;
      }
      for (let i of res.data[x].monitorStationDtos[0].linesOnMasterSortList) {
        tpl3 += '<option value="' + j + '">' + i.masterName + '</option>';
        j++;
      }
      for (let i of res.data[x].monitorStationDtos[0].linesOnMasterSortList[0].linesOnBranchDtos) {
        tpl4 += '<option value="' + l + '">' + i.branchName + '</option>';
        l++;
      }
      if (res.data[x].monitorStationDtos[0].linesOnMasterSortList[0].linesOnBranchDtos.length > 0) {
        for (let i of res.data[x].monitorStationDtos[0].linesOnMasterSortList[0].linesOnBranchDtos[0].monitorPointDtos) {
          if (h == 0) {
            //                   alert(i.monitorFlag)
            sessionStorage.monitorFlag = i.monitorFlag;
          };
          tpl5 += '<option data-type="' + i.hitchType + '" value="' + h + '">' + i.pointName + '</option>';
          h++;
        }
      };
      $('#site').append(tpl2);
      $('#generatrix').append(tpl3);
      $('#linesOnBranch').append(tpl4);
      $('#monitorPoint').append(tpl5);

      //  init(sessionStorage.monitorFlag)
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
    $('#site').change(function () {
      tpl3 = '';
      tpl4 = '';
      tpl5 = '';
      j = 0;
      l = 0;
      h = 0;
      $('#generatrix').empty();
      $('#linesOnBranch').empty();
      $('#monitorPoint').empty();
      x = $('#company  option:selected').val();
      parseInt(x);
      y = $('#site  option:selected').val();
      parseInt(y);
      sessionStorage.monitorFlag = 'null';
      for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList) {
        tpl3 += '<option value="' + j + '">' + i.masterName + '</option>';
        j++;
      }
      for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList[0].linesOnBranchDtos) {
        tpl4 += '<option value="' + l + '">' + i.branchName + '</option>';
        l++;
      }
      if (res.data[x].monitorStationDtos[y].linesOnMasterSortList[0].linesOnBranchDtos.length > 0) {
        for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList[0].linesOnBranchDtos[0].monitorPointDtos) {
          if (h == 0) {
            //                   alert(i.monitorFlag)
            sessionStorage.monitorFlag = i.monitorFlag;
          };
          tpl5 += '<option data-type="' + i.hitchType + '" value="' + h + '">' + i.pointName + '</option>';
          h++;
        }
      };
      $('#generatrix').append(tpl3);
      $('#linesOnBranch').append(tpl4);
      $('#monitorPoint').append(tpl5);

      //  init(sessionStorage.monitorFlag)
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
    $('#generatrix').change(function () {
      tpl4 = '';
      tpl5 = '';
      l = 0;
      j = 0;
      h = 0;
      $('#linesOnBranch').empty();
      $('#monitorPoint').empty();
      z = $('#generatrix  option:selected').val();
      parseInt(z);
      x = $('#company  option:selected').val();
      parseInt(x);
      y = $('#site  option:selected').val();
      parseInt(y);
      sessionStorage.monitorFlag = 'null';
      for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList[z].linesOnBranchDtos) {

        tpl4 += '<option value="' + l + '">' + i.branchName + '</option>';
        l++;
      }
      if (res.data[x].monitorStationDtos[y].linesOnMasterSortList[z].linesOnBranchDtos.length > 0) {
        for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList[z].linesOnBranchDtos[0].monitorPointDtos) {
          if (h == 0) {
            //                   alert(i.monitorFlag)
            sessionStorage.monitorFlag = i.monitorFlag;
          };
          tpl5 += '<option data-type="' + i.hitchType + '" value="' + h + '">' + i.pointName + '</option>';
          h++;
        }
      };
      $('#linesOnBranch').append(tpl4);
      $('#monitorPoint').append(tpl5);

      //  init(sessionStorage.monitorFlag)
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
    $('#linesOnBranch').change(function () {
      tpl5 = '';
      l = 0;
      j = 0;
      h = 0;
      $('#monitorPoint').empty();
      m = $('#linesOnBranch  option:selected').val();
      parseInt(m);
      z = $('#generatrix  option:selected').val();
      parseInt(z);
      x = $('#company  option:selected').val();
      parseInt(x);
      y = $('#site  option:selected').val();
      parseInt(y);
      sessionStorage.monitorFlag = 'null';
      for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList[z].linesOnBranchDtos[m].monitorPointDtos) {
        if (h == 0) {
          //                   alert(i.monitorFlag)
          sessionStorage.monitorFlag = i.monitorFlag;
        };
        tpl5 += '<option data-type="' + i.hitchType + '" value="' + h + '">' + i.pointName + '</option>';
        h++;
      }
      $('#monitorPoint').append(tpl5);
      //  init(sessionStorage.monitorFlag)
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
    $('#monitorPoint').change(function () {
      l = 0;
      j = 0;
      h = 0;
      n = $('#monitorPoint  option:selected').val();
      parseInt(n);
      m = $('#linesOnBranch  option:selected').val();
      parseInt(m);
      z = $('#generatrix  option:selected').val();
      parseInt(z);
      x = $('#company  option:selected').val();
      parseInt(x);
      y = $('#site  option:selected').val();
      parseInt(y);
      sessionStorage.monitorFlag = 'null';
      for (let i of res.data[x].monitorStationDtos[y].linesOnMasterSortList[z].linesOnBranchDtos[m].monitorPointDtos) {
        if (h == n) {
          //                   alert(i.monitorFlag);
          sessionStorage.monitorFlag = i.monitorFlag;
        };
        h++;
      }
      //  init(sessionStorage.monitorFlag);
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
  } else {
    $('.loadjy').removeClass('op');
    init(sessionStorage.deviceID);
  };
}, function () {
  $('.loadjy').addClass('op');
});


function init(monitorFlag) {
  var mydate = new Date(); //通过new方法创建对象
  if ($('#timeStart').val()) {
    timeStart = $('#timeStart').val() + ' 00:00:00:000';
  } else {
    //            timeStart = '1970-01-01 00:00:00:000';
    timeStart = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate() + ' 00:00:00:000';
  }
  if ($('#timeEnd').val()) {
    timeEnd = $('#timeEnd').val() + ' 23:59:59:000';
  } else {
    //            timeEnd = '2018-06-26 01:00:00:000';
    timeEnd = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate() + ' 23:59:59:000';
  }

  // 初始化波形图
  var _t = $('#monitorPoint  option:selected').data('type');
  if (_t == '温度采集器') {
    // alert('这是温度采集器')
    $('.showData #newtemper').click();
  } else {
    // alert('这是过电压保护器')
    $('.showData #temp').click();
  }
}
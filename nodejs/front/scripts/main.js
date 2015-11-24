/**
 * Created by Garance on 23/11/2015.
 */

/**
 * TEMPERATURES AT OFFICE 442
 * WINDOWS AT OFFICE 443
 **/
var SM_tempIn = '{"values":[{"date":"1434545566","value":"675"},{"date":"1434545567","value":"688"},{"date":"1434545568","value":"676"},{"date":"1434545570","value":"0"},{"date":"1434545571","value":"688"},{"date":"1434545572","value":"676"},{"date":"1434545573","value":"0"},{"date":"1434545574","value":"687"},{"date":"1434545575","value":"676"},{"date":"1434545576","value":"0"},{"date":"1434545844","value":"674"},{"date":"1434545845","value":"686"},{"date":"1434545846","value":"676"},{"date":"1434545848","value":"0"},{"date":"1434546322","value":"674"},{"date":"1434546323","value":"687"},{"date":"1434546324","value":"1"},{"date":"1434546546","value":"674"},{"date":"1434546547","value":"686"},{"date":"1434546548","value":"0"},{"date":"1434546627","value":"674"},{"date":"1434546629","value":"686"},{"date":"1434546630","value":"0"},{"date":"1434546631","value":"687"},{"date":"1434546632","value":"0"},{"date":"1434546680","value":"674"},{"date":"1434546681","value":"686"},{"date":"1434546682","value":"0"},{"date":"1434547000","value":"674"},{"date":"1434547001","value":"687"},{"date":"1434547002","value":"677"},{"date":"1434547003","value":"0"}]}';
var SM_tempOut = '{"values":[{"date":"1434545566","value":"445"},{"date":"1434545567","value":"356"},{"date":"1434545568","value":"345"},{"date":"1434545570","value":"345"},{"date":"1434545571","value":"765"},{"date":"1434545572","value":"676"},{"date":"1434545573","value":"0"},{"date":"1434545574","value":"687"},{"date":"1434545575","value":"765"},{"date":"1434545576","value":"345"},{"date":"1434545844","value":"345"},{"date":"1434545845","value":"765"},{"date":"1434545846","value":"345"},{"date":"1434545848","value":"456"},{"date":"1434546322","value":"543"},{"date":"1434546323","value":"543"},{"date":"1434546324","value":"345"},{"date":"1434546546","value":"876"},{"date":"1434546547","value":"879"},{"date":"1434546548","value":"654"},{"date":"1434546627","value":"674"},{"date":"1434546629","value":"654"},{"date":"1434546630","value":"654"},{"date":"1434546631","value":"654"},{"date":"1434546632","value":"654"},{"date":"1434546680","value":"654"},{"date":"1434546681","value":"654"},{"date":"1434546682","value":"632"},{"date":"1434547000","value":"621"},{"date":"1434547001","value":"621"},{"date":"1434547002","value":"621"},{"date":"1434547003","value":"621"}]}';

var SM_windows = '{"values":[{"date":"1434630382","value":"2"},{"date":"1434630383","value":"0"},{"date":"1434630385","value":"5"},{"date":"1434630398","value":"1"},{"date":"1434630457","value":"6"},{"date":"1434630458","value":"0"},{"date":"1434630491","value":"2"},{"date":"1434630492","value":"6"},{"date":"1434630498","value":"3"},{"date":"1434630499","value":"0"},{"date":"1434630547","value":"3"},{"date":"1434630548","value":"0"},{"date":"1434630567","value":"1"},{"date":"1434630568","value":"3"},{"date":"1434630574","value":"4"},{"date":"1434630575","value":"0"},{"date":"1434630582","value":"2"},{"date":"1434630588","value":"6"},{"date":"1434630594","value":"8"},{"date":"1434630655","value":"3"},{"date":"1434630659","value":"3"},{"date":"1434630660","value":"1"},{"date":"1434630666","value":"3"},{"date":"1434698517","value":"1"},{"date":"1434718743","value":"2"},{"date":"1434718746","value":"0"},{"date":"1434720299","value":"2"},{"date":"1434720300","value":"0"},{"date":"1434720302","value":"1"},{"date":"1434970026","value":"2"},{"date":"1434970048","value":"0"},{"date":"1434970049","value":"3"}]}';
var SM_AirConditionning = '{"values":[{"date":"1434630382","value":"100"},{"date":"1434630383","value":"10"},{"date":"1434630385","value":"100"},{"date":"1434630398","value":"25"},{"date":"1434630457","value":"45"},{"date":"1434630458","value":"56"},{"date":"1434630491","value":"34"},{"date":"1434630492","value":"65"},{"date":"1434630498","value":"35"},{"date":"1434630499","value":"45"},{"date":"1434630547","value":"20"},{"date":"1434630548","value":"20"},{"date":"1434630567","value":"10"},{"date":"1434630568","value":"0"},{"date":"1434630574","value":"0"},{"date":"1434630575","value":"20"},{"date":"1434630582","value":"25"},{"date":"1434630588","value":"30"},{"date":"1434630594","value":"0"},{"date":"1434630655","value":"5"},{"date":"1434630659","value":"12"},{"date":"1434630660","value":"15"},{"date":"1434630666","value":"18"},{"date":"1434698517","value":"31"},{"date":"1434718743","value":"32"},{"date":"1434718746","value":"45"},{"date":"1434720299","value":"100"},{"date":"1434720300","value":"100"},{"date":"1434720302","value":"100"},{"date":"1434970026","value":"90"},{"date":"1434970048","value":"90"},{"date":"1434970049","value":"93"}]}';


var tempPeriod = [];
var tempIn_result = [];
var tempOut_result = [];

var hourlyPeriod = [];
var open_result = [];
var ac_result = [];

// Transform text to JSON
tempIn = JSON.parse(SM_tempIn);
tempOut = JSON.parse(SM_tempOut);
hourlyWindow = JSON.parse(SM_windows);
hourlyAC = JSON.parse(SM_AirConditionning);


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

// Parse and add values of JSON in arrays
for(var i = 0; i < tempIn.values.length; i++)
{
    tempPeriod.push(timeConverter(tempIn.values[i].date));
    tempIn_result.push(parseInt(tempIn.values[i].value));
    tempOut_result.push(parseInt(tempOut.values[i].value));

}

for(var i = 0; i < hourlyWindow.values.length; i++)
{
    hourlyPeriod.push(timeConverter(hourlyWindow.values[i].date));
    open_result.push(parseInt(hourlyWindow.values[i].value));
    ac_result.push(parseInt(hourlyAC.values[i].value));
}


$(function () {
    $('#c1').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'In vs Out temperature'
        },
        subtitle: {
            text: 'office 344'
        },
        xAxis: {
            categories: tempPeriod
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        tooltip: {
            shared: true,
            crosshairs: true
        },
        series: [{
            name: 'office 344 temperature inside',
            data: tempIn_result
        },
            {name: 'office 344 temperature outside',
            data: tempOut_result}
        ]
    });
});



$(function () {
    $('#c2').highcharts({
        chart: {
            type: 'column',
            alignTicks: false
        },
        title: {
            text: 'Window openings vs. A/C use'
        },
        subtitle: {
            text: 'office 344'
        },
        xAxis: {
            categories: hourlyPeriod,
            crosshair: true
        },
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}'
            },
            title: {
                text: 'Openings'
            },
            allowDecimals: false,
        }, { // Secondary yAxis
            title: {
                text: 'ACUse'
            },
            max : 100,
            labels: {
                format: '{value} %'
            },
            opposite: true
        }],
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Openings',
            data: open_result,
            yAxis: 0
        }, {
            name: 'ACUse',
            data: ac_result,
            yAxis: 1
        }]
    });
});

/**
 The boolean values for A/C and window :
 */
var acOn = true;
var windowOpen = false;
if (!acOn)
    document.getElementById('climState').setAttribute("class", "label label-danger");
else
    document.getElementById('climState').setAttribute("class", "label label-success");

if (!windowOpen)
    document.getElementById('windowState').setAttribute("class", "label label-danger");
else
    document.getElementById('windowState').setAttribute("class", "label label-success");

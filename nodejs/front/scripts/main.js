56/**
 * Created by Garance on 23/11/2015.
 */

/**
 * TEMPERATURES AT OFFICE 442
 * WINDOWS AT OFFICE 443
 **/
var SM_tempIn = '{"values":[{"date":"1434545566","value":"675"},{"date":"1434545567","value":"688"},{"date":"1434545568","value":"676"},{"date":"1434545570","value":"0"},{"date":"1434545571","value":"688"},{"date":"1434545572","value":"676"},{"date":"1434545573","value":"0"},{"date":"1434545574","value":"687"},{"date":"1434545575","value":"676"},{"date":"1434545576","value":"0"},{"date":"1434545844","value":"674"},{"date":"1434545845","value":"686"},{"date":"1434545846","value":"676"},{"date":"1434545848","value":"0"},{"date":"1434546322","value":"674"},{"date":"1434546323","value":"687"},{"date":"1434546324","value":"1"},{"date":"1434546546","value":"674"},{"date":"1434546547","value":"686"},{"date":"1434546548","value":"0"},{"date":"1434546627","value":"674"},{"date":"1434546629","value":"686"},{"date":"1434546630","value":"0"},{"date":"1434546631","value":"687"},{"date":"1434546632","value":"0"},{"date":"1434546680","value":"674"},{"date":"1434546681","value":"686"},{"date":"1434546682","value":"0"},{"date":"1434547000","value":"674"},{"date":"1434547001","value":"687"},{"date":"1434547002","value":"677"},{"date":"1434547003","value":"0"}]}';
var SM_tempOut = '{"values":[{"date":"1434545566","value":"445"},{"date":"1434545567","value":"356"},{"date":"1434545568","value":"345"},{"date":"1434545570","value":"345"},{"date":"1434545571","value":"765"},{"date":"1434545572","value":"676"},{"date":"1434545573","value":"0"},{"date":"1434545574","value":"687"},{"date":"1434545575","value":"765"},{"date":"1434545576","value":"345"},{"date":"1434545844","value":"345"},{"date":"1434545845","value":"765"},{"date":"1434545846","value":"345"},{"date":"1434545848","value":"456"},{"date":"1434546322","value":"543"},{"date":"1434546323","value":"543"},{"date":"1434546324","value":"345"},{"date":"1434546546","value":"876"},{"date":"1434546547","value":"879"},{"date":"1434546548","value":"654"},{"date":"1434546627","value":"674"},{"date":"1434546629","value":"654"},{"date":"1434546630","value":"654"},{"date":"1434546631","value":"654"},{"date":"1434546632","value":"654"},{"date":"1434546680","value":"654"},{"date":"1434546681","value":"654"},{"date":"1434546682","value":"632"},{"date":"1434547000","value":"621"},{"date":"1434547001","value":"621"},{"date":"1434547002","value":"621"},{"date":"1434547003","value":"621"}]}';

var SM_windows = '{"values":[{"date":"1434630382","value":"1023"},{"date":"1434630383","value":"0"},{"date":"1434630385","value":"1023"},{"date":"1434630398","value":"0"},{"date":"1434630457","value":"1023"},{"date":"1434630458","value":"0"},{"date":"1434630491","value":"1023"},{"date":"1434630492","value":"6"},{"date":"1434630498","value":"1023"},{"date":"1434630499","value":"0"},{"date":"1434630547","value":"504"},{"date":"1434630548","value":"0"},{"date":"1434630567","value":"1023"},{"date":"1434630568","value":"3"},{"date":"1434630574","value":"1023"},{"date":"1434630575","value":"0"},{"date":"1434630582","value":"1023"},{"date":"1434630588","value":"6"},{"date":"1434630594","value":"890"},{"date":"1434630655","value":"3"},{"date":"1434630659","value":"1023"},{"date":"1434630660","value":"1"},{"date":"1434630666","value":"1023"},{"date":"1434698517","value":"1"},{"date":"1434718743","value":"1023"},{"date":"1434718746","value":"0"},{"date":"1434720299","value":"1023"},{"date":"1434720300","value":"0"},{"date":"1434720302","value":"1023"},{"date":"1434970026","value":"1017"},{"date":"1434970048","value":"0"},{"date":"1434970049","value":"1023"}]}';

var tempPeriod = [];
var tempIn_result = [];
var tempOut_result = [];

var time2 = [];
var open_result = [];

// Transform text to JSON
tempIn = JSON.parse(SM_tempIn);
tempOut = JSON.parse(SM_tempOut);
json2 = JSON.parse(SM_windows);

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

for(var i = 0; i < json2.values.length; i++)
{
    time2.push(timeConverter(json2.values[i].date));
    open_result.push(parseInt(json2.values[i].value));
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
                },
                enableMouseTracking: false
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
            type: 'column'
        },
        title: {
            text: 'Windows 443'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: time2,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
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
            name: 'windows opened',
            data: open_result
        }]
    });
});
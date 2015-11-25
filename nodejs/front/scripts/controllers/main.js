/**
 * Created by Garance on 23/11/2015.
 */

/**
 * WINDOWS AT OFFICE 443
 **/
var SM_windows = '{"values":[{"date":"1434630382","value":"2"},{"date":"1434630383","value":"0"},{"date":"1434630385","value":"5"},{"date":"1434630398","value":"1"},{"date":"1434630457","value":"6"},{"date":"1434630458","value":"0"},{"date":"1434630491","value":"2"},{"date":"1434630492","value":"6"},{"date":"1434630498","value":"3"},{"date":"1434630499","value":"0"},{"date":"1434630547","value":"3"},{"date":"1434630548","value":"0"},{"date":"1434630567","value":"1"},{"date":"1434630568","value":"3"},{"date":"1434630574","value":"4"},{"date":"1434630575","value":"0"},{"date":"1434630582","value":"2"},{"date":"1434630588","value":"6"},{"date":"1434630594","value":"8"},{"date":"1434630655","value":"3"},{"date":"1434630659","value":"3"},{"date":"1434630660","value":"1"},{"date":"1434630666","value":"3"},{"date":"1434698517","value":"1"},{"date":"1434718743","value":"2"},{"date":"1434718746","value":"0"},{"date":"1434720299","value":"2"},{"date":"1434720300","value":"0"},{"date":"1434720302","value":"1"},{"date":"1434970026","value":"2"},{"date":"1434970048","value":"0"},{"date":"1434970049","value":"3"}]}';
var SM_AirConditionning = '{"values":[{"date":"1434630382","value":"100"},{"date":"1434630383","value":"10"},{"date":"1434630385","value":"100"},{"date":"1434630398","value":"25"},{"date":"1434630457","value":"45"},{"date":"1434630458","value":"56"},{"date":"1434630491","value":"34"},{"date":"1434630492","value":"65"},{"date":"1434630498","value":"35"},{"date":"1434630499","value":"45"},{"date":"1434630547","value":"20"},{"date":"1434630548","value":"20"},{"date":"1434630567","value":"10"},{"date":"1434630568","value":"0"},{"date":"1434630574","value":"0"},{"date":"1434630575","value":"20"},{"date":"1434630582","value":"25"},{"date":"1434630588","value":"30"},{"date":"1434630594","value":"0"},{"date":"1434630655","value":"5"},{"date":"1434630659","value":"12"},{"date":"1434630660","value":"15"},{"date":"1434630666","value":"18"},{"date":"1434698517","value":"31"},{"date":"1434718743","value":"32"},{"date":"1434718746","value":"45"},{"date":"1434720299","value":"100"},{"date":"1434720300","value":"100"},{"date":"1434720302","value":"100"},{"date":"1434970026","value":"90"},{"date":"1434970048","value":"90"},{"date":"1434970049","value":"93"}]}';


var hourlyPeriod = [];
var open_result = [];
var ac_result = [];

// Transform text to JSON
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
for(var i = 0; i < hourlyWindow.values.length; i++)
{
    hourlyPeriod.push(timeConverter(hourlyWindow.values[i].date));
    open_result.push(parseInt(hourlyWindow.values[i].value));
    ac_result.push(parseInt(hourlyAC.values[i].value));
}

//Success callback for retrieving the inside temperatures
var firstSuccessInTemp = function(data) {
    var periodWanted =data.time;
    var insideTemperature = data.temperatures;
    console.log(insideTemperature);

    var secondSuccessInTemp = function(data) {
        var outsideTemperature = data.temperatures;
        console.log(outsideTemperature);
        $(function () {
            $('#c1').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'In vs Out temperature'
                },
                subtitle: {
                    text: 'office 443'
                },
                xAxis: {
                    categories: periodWanted
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    minTickInterval:1
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
                    name: 'office 443 temperature inside',
                    data: insideTemperature
                },
                 {name: 'office 443 temperature outside',
                 data: outsideTemperature}
                ]
            });
        });
    };

    //We need to get the outside temperatures now, to build our whole graph.
    retrieveData.askForTemp('campus/temperature', beginDate, endDate, secondSuccessInTemp);
};
var beginDate = '2015-10-14 8:00:11';
var endDate = '2015-10-20 18:00:11';

//First step of data retrieving : we get the inside temperatures
retrieveData.askForTemp('office/443/temperature', beginDate, endDate, firstSuccessInTemp);



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

var successForWindow = function(data) {
    console.log('in success result');
    if (data.state == 'CLOSED') {
        document.getElementById('windowState').setAttribute("class", "label label-danger");
    }
    else {
        document.getElementById('windowState').setAttribute("class", "label label-success");
    }
};
var successForAC = function(data) {
    if (data.state == 'OFF')
        document.getElementById('climState').setAttribute("class", "label label-danger");
    else
        document.getElementById('climState').setAttribute("class", "label label-success");
};

retrieveData.askForStateNow('office/443/window_status', successForWindow);
retrieveData.askForStateNow('office/443/ac_status', successForAC);

/**
 * Datepikckers
 */



$('#datetimepicker1').datetimepicker({
    format: 'YYYY-MM-DD HH:mm:ss'
});

$('#datetimepicker2').datetimepicker({
    format: 'YYYY-MM-DD HH:mm:ss'
});

$( "#refresh" ).click(function() {
    var from = $('#datetimepicker1').data('date');
    var to = $('#datetimepicker2').data('date');
    retrieveData.askForTemp('office/443/temperature', from, to, firstSuccessInTemp);

});


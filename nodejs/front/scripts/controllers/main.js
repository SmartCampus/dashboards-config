/**
 * Created by Garance on 23/11/2015.
 */

var SM_AirConditioning = '[[196,100],[201,10],[202,100],[303,25],[304,45],[305,56],[306,34]]';

// Transform text to JSON
hourlyAC = JSON.parse(SM_AirConditioning);
console.log(hourlyAC);

//Success callback for retrieving the inside temperatures
var firstSuccessInTemp = function(data) {
    var insideTemperature = data.data;
    console.log(insideTemperature);

    var secondSuccessInTemp = function(data) {
        var outsideTemperature = data.data;
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
                    labels: {
                        formatter: function () {
                            return  Highcharts.dateFormat('%d.%m.%Y', this.value*1000)
                        }
                    },
                  //  tickInterval: 24 * 3600 * 1000,
                    type: 'category'
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
                    crosshairs: true,
                    formatter: function() {
                        return '<br/>'+
                            Highcharts.dateFormat('%d.%m.%Y', this.x*1000) +' : '+ parseInt(this.y)+' °C <br/> <br/>';
                    }
                },
                series: [{
                    name: 'office 443 temperature inside',
                    data: insideTemperature
                },
                 {
                     name: 'office 443 temperature outside',
                     data: outsideTemperature
                 }
                ]
            });
        });
    };

    //We need to get the outside temperatures now, to build our whole graph.
    retrieveData.askForSeries('campus/temperature', beginDate, endDate, secondSuccessInTemp);
};

var place = 'office/443/';
if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-10-14 8:00:11';
    endDate = '2015-10-20 18:00:11';
}

//First step of data retrieving : we get the inside temperatures
retrieveData.askForSeries(place+'temperature', beginDate, endDate, firstSuccessInTemp);



successForWindowCount = function(data) {
    //Here, we must process if needed the data received, and then call the ac count
var windowCount = data.data;
console.log('in the window method');

    //successForAcCount = function(data) {
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
                    //  tickInterval: 24 * 3600 * 1000,
                    type: 'category'
                },
                yAxis: [{ // Primary yAxis
                    title: {
                        text: 'ACUse'
                    },
                    max: 100,
                    labels: {
                        format: '{value} %'
                    }
                }, { // Secondary yAxis
                    title: {
                        text: 'Openings'
                    },
                    labels: {
                        format: '{value}'
                    },
                    allowDecimals: false,
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
                    name: 'ACUse',
                    data: hourlyAC,
                    yAxis: 0
                }, {
                    name: 'WindowOpenings',
                    data: windowCount,
                    yAxis: 1
                }]
            });
        });
    //};
    //retrieveData.askForSeries(place+'ac_percentage', beginDate, beginDate, successForAcCount);

};
//successForWindowCount();
retrieveData.askForSeriesForever(place+'window_opening',successForWindowCount);

/**
 The boolean values for A/C and window :
 */

var successForWindow = function(data) {
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

retrieveData.askForStateNow(place+'window_status', successForWindow);
retrieveData.askForStateNow(place+'ac_status', successForAC);

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
    beginDate = $('#datetimepicker1').data('date');
    endDate = $('#datetimepicker2').data('date');
    retrieveData.askForSeries(place+'temperature', beginDate, endDate, firstSuccessInTemp);

});


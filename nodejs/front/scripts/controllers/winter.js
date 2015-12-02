/**
 * Created by salahbennour on 02/12/2015.
 */

/************************************
 *          VARIABLES               *
 ************************************/

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-05-01 8:00:11';
    endDate = '2015-12-01 18:00:11';
}


var temperaturesArray = [];

var firstSuccessInTemp = function (data, callback) {
    temperaturesArray[0] = {"type": 'line', "name": "inside temparature", "data": data.data,  "yAxis": 1};
    callback();
};

var secondSuccessInTemp = function (data, callback) {
    temperaturesArray[1] = {"type": 'line',"name": "outside temparature", "data": data.data,  "yAxis": 1};
    callback();
};


var thirdSuccessInTemp = function (data, callback) {
    temperaturesArray[2] = {"type": 'column',"name": "heater state" , "data": data.data[0].open,  "yAxis": 0};
    callback();
};

var toUpdate = 0;

function updateCallback(){
    if( toUpdate < 1){
        toUpdate++;
    }else{
        drawLineChart();
        toUpdate = 0;
    }
}

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate,
    function(data){
        firstSuccessInTemp(data, updateCallback)
    }
);

retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate,
    function(data) {
        secondSuccessInTemp(data, updateCallback);
    }
);


retrieveData.askForSeriesWithParam('DOOR443STATE/data/splitlist', 'true', beginDate, endDate,
    function (data) {
        thirdSuccessInTemp(data, updateCallback);
    }
);

var drawLineChart = function() {

    $('#c1').highcharts('StockChart', {

        yAxis:
        [
            { // Primary yAxis
                min: 0,

                title: {
                    text: 'heater state',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },

                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },

                style: {
                    color: Highcharts.getOptions().colors[1]
                },

                opposite: false
            },
            {
                title: {
                    text: 'Temperature (°C)',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },

                minTickInterval: 1,

                plotLines: [{
                    value: 0,
                    color: 'red',
                    dashStyle: 'shortdash', //pointillé
                    width: 2,
                    label: { text: '0°C'}
                }],

                labels: {
                    format: '{value} °C',
                    style: {
                        color: Highcharts.getOptions().colors[3]
                    }
                },

                style: {
                    color: Highcharts.getOptions().colors[3]
                },

                allowDecimals: false,
                opposite: true
            }
        ],

        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        series: temperaturesArray
    });
};
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

var allLoaded = 0;
/**
 * Should be changed once we add the data link for door and heater state !
 */
var finishedLoading = function () {
    if (allLoaded < 1) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
};

var errorOccurred = function () {
    document.getElementById("errorOccured").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};
/*
 HEATING_443
 */
var successForHeating = function (data) {
    generate.widgetBoolean("heaterState", function (result) {
        finishedLoading();
        eval(result);
    }, errorOccurred);
};
retrieveData.askForStateNow('HEATING_443', successForHeating, errorOccurred);

var temperaturesArray = [];

var firstSuccessInTemp = function (data, callback) {
    temperaturesArray[0] = {"type": "line", "name": "inside temparature", "data": data.data, "yAxis": 1};
    callback();
};

var secondSuccessInTemp = function (data, callback) {
    temperaturesArray[1] = {"type": "line", "name": "outside temparature", "data": data.data, "yAxis": 1};
    callback();
};


var thirdSuccessInTemp = function (data, callback) {
    temperaturesArray[2] = {"type": "column", "name": "Heating status", "data": data.data[0].open, "yAxis": 0};
    callback();
};

var toUpdate = 0;

function updateCallback() {
    if (toUpdate < 1) {
        toUpdate++;
    } else {
        drawLineChart();
        toUpdate = 0;
    }
}

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate,
    function (data) {
        firstSuccessInTemp(data, updateCallback)
    }
    , errorOccurred);

retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate,
    function (data) {
        secondSuccessInTemp(data, updateCallback);
    }
    , errorOccurred);


retrieveData.askForSeriesWithParam('DOOR443STATE/data/splitlist', 'true', beginDate, endDate,
    function (data) {
        thirdSuccessInTemp(data, updateCallback);
    }
    , errorOccurred);

var drawLineChart = function () {
    $('#c1').highcharts('StockChart', {
        yAxis: [
            { // Primary yAxis
                min: 0,
                title: {
                    text: 'heating status',
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
                    label: {text: '0°C'}
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
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        series: temperaturesArray
    });
    finishedLoading();
};

var lightData = [[1228953600000, 13.57],
    [1229040000000, 14.04],
    [1229299200000, 13.54],
    [1229385600000, 13.63],
    [1229472000000, 12.74],
    [1229558400000, 12.78],
    [1229644800000, 12.86],
    [1229904000000, 12.25],
    [1229990400000, 12.34],
    [1230076800000, 12.15],
    [1230249600000, 12.26],
    [1230508800000, 12.37],
    [1230595200000, 12.33],
    [1230681600000, 12.19],
    [1230854400000, 12.96],
    [1231113600000, 13.51],
    [1231200000000, 13.29],
    [1231286400000, 13.00],
    [1231372800000, 13.24],
    [1231459200000, 12.94],
    [1231718400000, 12.67],
    [1231804800000, 12.53],
    [1231891200000, 12.19],
    [1231977600000, 11.91],
    [1232064000000, 11.76],
    [1232409600000, 11.17],
    [1232496000000, 11.83],
    [1232582400000, 12.62],
    [1232668800000, 12.62],
    [1232928000000, 12.81],
    [1233014400000, 12.96],
    [1233100800000, 13.46],
    [1233187200000, 13.29],
    [1233273600000, 12.88]];
var drawLineChartForLight = function () {
    $('#lightLevel').highcharts('StockChart', {
        rangeSelector: {
            selected: 1
        },
        yAxis: { // Primary yAxis
            min: 0,
            title: {
                text: 'Brightness level',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },

            labels: {
                format: '{value} lumen',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },

            style: {
                color: Highcharts.getOptions().colors[0]
            },
            plotLines: [{
                value: 12,
                color: 'red',
                dashStyle: 'shortdash', //pointillé
                width: 2,
                label: {
                    text: 'Day / night threshold'
                }
            }],
        },
        series: [{
            name: 'Brightness level',
            data: lightData,
            tooltip: {
                valueDecimals: 0
            }
        }]
    });
};

drawLineChartForLight();
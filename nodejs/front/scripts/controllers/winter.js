/**
 * Created by salahbennour on 02/12/2015.
 */

/************************************
 *          VARIABLES               *
 ************************************/

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-10-09 8:00:11';
    endDate = '2015-12-15 18:00:11';
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
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};
/*
 HEATING_443
 */
var successForHeating = function (data) {
    var heaterState = data;
    generate.widgetBoolean("heaterState", "heaterState", "Heating", function (result) {
        finishedLoading();
        eval(result);
    }, errorOccurred);
};
retrieveData.askForStateNow('HEATING_443', successForHeating, errorOccurred);

var temperaturesArray = [];

var firstSuccessInTemp = function (data, callback) {
    temperaturesArray[2] = {"type": "line", "name": "inside temparature", "data": data.data, "yAxis": 1};
    callback();
};

var secondSuccessInTemp = function (data, callback) {
    //console.log(data.data);
    temperaturesArray[1] = {"type": "line", "name": "outside temparature", "data": data.data, "yAxis": 1};
    callback();
};

var thirdSuccessInTemp = function (data, callback) {
    temperaturesArray[0] = {
        "type": "column", "name": "Heating status", "data": data.data, "yAxis": 0, "dataGrouping": {
            "approximation": "average"
        }
    };
    callback();
};

var toUpdate = 0;

function updateCallback() {
    if (toUpdate < 2) {
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


retrieveData.askForSeriesWithParam('AC_443STATE/data/reverse', "true", beginDate, endDate,
    function (data) {
        thirdSuccessInTemp(data, updateCallback);
    }
    , errorOccurred);

var drawLineChart = function () {
    //The y axes must be declared in the same order as how they are used in the data array
    generate.widgetV2("Heating status in comparison to inside and outside temperatures", "",
        [{
            unit: "state",
            "title": "Heating status",
            "amount": 1
        }, {
            unit: "temperature",
            "title": "Température (°C)",
            "amount": 2
        }], "c1", "temperaturesArray", function(data) {
            console.log(data);
            eval(data);

        }, function(error) {
           console.log('error :(');

        });

    /*$('#c1').highcharts('StockChart', {
        chart: {
            zoomType: 'x'
        },
        yAxis: [
            { // Primary yAxis
                min: 0,
                max: 100,
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
    });*/
    finishedLoading();
};
var lightData = {};


retrieveData.askForSeries('LIGHT_444/data', beginDate, endDate,
    function (data) {
        successInLight(data)
    }, errorOccurred);

var successInLight = function (data) {
    lightData.name = "Brightness level";
    lightData.data = data.data;
    drawLineChartForLight();
};

var drawLineChartForLight = function () {
    var lightInArray = [];
    lightInArray.push(lightData);
    generate.widgetV2("Brightness level evolution", "line", [{
        unit: "lux",
        "title": "Brightness level",
        "amount": 1
    }], "lightLevel", "lightInArray", function (data) {
        eval(data);
    }, function (error) {
        console.log('error :(');
    });
};
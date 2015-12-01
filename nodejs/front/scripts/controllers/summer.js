/**
 * Created by Garance on 30/11/2015.
 */

/** The dashboard parametres **/
var place = 'office/443/';
if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}


var temperaturesArray = [];
var drawLineChart = function() {
    /**
     * Create the chart when all data is loaded
     * @returns {undefined}
     */
    $('#c1').highcharts('StockChart', {

        yAxis: {

            title: {
                text: 'Temperature (°C)'
            },

            minTickInterval: 1,

            plotLines: [{
                value: 0,
                color: 'red',
                dashStyle: 'shortdash', //pointillé
                width: 2,
                label: { text: '0°C'}
            }]
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
            valueDecimals: 2
        },

        series: temperaturesArray
    });
};



var firstSuccessInTemp = function (data) {
    temperaturesArray[0] = {"name": "inside temparature", "data": data.data};
    console.log('in 1st success for temp');
    //console.log(temperaturesArray[0]);
    var secondSuccessInTemp = function (data) {
        temperaturesArray[1] = {"name": "outside temparature", "data": data.data};
        console.log('in 2nd success for temp');
        drawLineChart();
    };
    //We need to get the outside temperatures now, to build our whole graph.
    console.log('about to ask for campus temp');
    retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate, secondSuccessInTemp);
    //retrieveData.askForSeriesForever('TEMP_CAMPUS/data', secondSuccessInTemp);
};

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate, firstSuccessInTemp);
//retrieveData.askForSeriesForever('TEMP_443V/data', firstSuccessInTemp);

var drawBarChart = function() {
    $(function () {
        // create the chart
        $('#c2').highcharts('StockChart', {

            chart: {
                type: 'column',
                zoomType: 'x'
            },

            xAxis: {
                type: 'datetime'
            },

            yAxis: [
                { // Primary yAxis
                    min: 0,

                    title: {
                        text: '% of time AC is on',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },

                    labels: {
                        format: '{value} %',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },

                    style: {
                        color: Highcharts.getOptions().colors[1]
                    },

                    opposite: false
                },
                { // Secondary yAxis

                    title: {
                        text: 'Nb of times the window got opened',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },

                    labels: {
                        format: '{value}',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },

                    style: {
                        color: Highcharts.getOptions().colors[0]
                    },

                    allowDecimals: false,
                    opposite: true
                }],

            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },

            series: [
                {
                    name: countingArray[0].name,
                    data: countingArray[0].data,
                    dataGrouping: {
                        forced: true,
                        approximation:'sum',
                        /*units: [
                            [
                                'hour',[1]
                            ],
                            [
                                'day', [1]
                            ],
                            [
                                'week', [1]
                            ],[
                                'month', [1]
                            ]
                        ],*/
                        groupPixelWidth: 50
                    },
                    yAxis: 1
                },
                {
                    name: countingArray[1].name,
                    data: countingArray[1].data,
                    dataGrouping: {
                        forced: true,
                        approximation:'average',
                       /* units: [
                            [
                            'hour',[1]
                            ],
                            [
                                'day', [1]
                            ],
                            [
                                'week', [1]
                            ],[
                                'month', [1]
                            ]
                        ],*/
                        groupPixelWidth: 50
                       },
                    yAxis: 0
                }
            ]
        });
    });
};


var countingArray = [];
var successForWindowCount = function (data) {
    countingArray[0] = {"name": "nb of window openings", "data": data.data};
    console.log(countingArray[0].data);
    console.log('in the window method');

    successForAcCount = function (data) {
        countingArray[1] = {"name": "% of time the AC is on", "data": data.data};
        drawBarChart();
    };
    retrieveData.askForSeriesWithParam('AC_443STATE/data', 'true', beginDate, endDate, successForAcCount);
};

retrieveData.askForSeriesWithParam('WINDOW443STATE/data', 'true', beginDate, endDate, successForWindowCount);


/**
 The boolean values for A/C and window :
 */
var successForWindow = function (data) {
    if (data.state == 'CLOSED') {
        document.getElementById('windowState').setAttribute("class", "label label-danger");
    }
    else {
        document.getElementById('windowState').setAttribute("class", "label label-success");
    }
};
var successForAC = function (data) {
    if (data.state == 'OFF')
        document.getElementById('climState').setAttribute("class", "label label-danger");
    else
        document.getElementById('climState').setAttribute("class", "label label-success");
};

//retrieveData.askForStateNow(place + 'window_status', successForWindow);
//retrieveData.askForStateNow(place + 'ac_status', successForAC);

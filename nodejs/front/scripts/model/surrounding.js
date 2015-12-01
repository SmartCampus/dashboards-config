/**
 * Created by salahbennour on 25/11/2015.
 */

/************************************
 *          VARIABLES               *
 ************************************/

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}

var myURL = '//localhost:8082/sensor/DOOR443STATE/data?state=true&date=2015-05-01+8%3A00%3A11%2F2015-12-01+18%3A00%3A11';
var doorState = [];
var windowState = [];



var successForDoorStateInTime = function (data) {
    console.log('Entrer ici !');
    doorState[0] = {"name": "CLOSE" , "data": data.data}; // color: 'rgba(223, 83, 83, .5)'
    //doorState[1] = {"name": "OPEN" , color: 'rgba(119, 152, 191, .5)', "data": data.data};
    doorGraphStateInTime();
};

retrieveData.askForSeriesWithParam('DOOR443STATE/data', 'true', beginDate, endDate, successForDoorStateInTime);


/**
 * Graphe de l'état de la porte/fenêtre par rapport au temps
 */

var doorGraphStateInTime = function() {

        $('#g1').highcharts('StockChart', {

            chart: {
                type: 'scatter',
                zoomType: 'x'
            },

            title: {
                text: 'Door status in time'
            },

            xAxis: {
                type: 'datetime'
            },

            yAxis: {
                categories: ['Close','Open'],
                opposite: false
            },

            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat:    '<tr><td style="color:{series.color};padding:0">{series.name}</td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },

            series : doorState
        });
};


$(function () {
    $('#g2').highcharts({

        chart: {
            type: 'scatter',
            zoomType: 'x'
        },

        title: {
            text: 'Windows status in time '
        },

        xAxis: {
            title: {
                text: 'Time'
            }
        },

        yAxis: {
            title: {
                text: ''
            },
            categories: ['Close', 'Open']
        },

        series: [{
            name: 'Close',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 0], [167.5, 0], [159.5, 0], [157.0, 0], [155.8, 0]]

        }, {
            name: 'Open',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 1], [175.3, 1], [193.5, 1], [186.5, 1], [187.2, 1]]
        }]
    });
});



/**
 * Graphe intensité sonore
 */

$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        $('#c1').highcharts('StockChart', {

            // titre
            title : {
                text : 'Intensité sonore par rapport à la porte'
            },

            // Selectionne un interval de temps proposé par default
            rangeSelector : {
                selected : 1
            },

            yAxis: [
                { // Primary yAxis
                    min: 0,

                    title: {
                        text: 'Nb of times the door got opened',
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
                { // Secondary yAxis

                    title: {
                        text: 'intensité sonore',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },

                    // Affichage seuil
                    plotLines: [{
                        value: 2,
                        color: 'red',
                        dashStyle: 'shortdash', //pointillé
                        width: 2,
                        label: {
                            text: 'Seuil du bruit'
                        }
                    }],

                    labels: {
                        format: '{value} db',
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
                    name : 'Intensité sonore',
                    data : data,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                {
                    type: 'column',
                    name: 'Etat de la porte',
                    data: data,
                    yAxis: 1
                }
            ]

        });
    });
});


$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        $('#c2').highcharts('StockChart', {

            // titre
            title : {
                text : 'Intensité sonore par rapport à la fenêtre'
            },

            // Selectionne un interval de temps proposé par default
            rangeSelector : {
                selected : 1
            },

            yAxis: [
                { // Primary yAxis
                    min: 0,

                    title: {
                        text: 'Nb of times the windows got opened',
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
                { // Secondary yAxis

                    title: {
                        text: 'intensité sonore',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },

                    // Affichage seuil
                    plotLines: [{
                        value: 2,
                        color: 'red',
                        dashStyle: 'shortdash', //pointillé
                        width: 2,
                        label: {
                            text: 'Seuil du bruit'
                        }
                    }],

                    labels: {
                        format: '{value} db',
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
                    name : 'Intensité sonore',
                    data : data,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                {
                    type: 'column',
                    name: 'Etat de la fenêtre',
                    data: data,
                    yAxis: 1
                }
            ]

        });
    });
});


/**
 * Camenbert état de la porte/fenêtre
 */

$(function () {
    $(document).ready(function () {

        $('#cam1').highcharts({

            chart: {
                type: 'pie'
            },

            title: {
                text: 'Door'
            },

            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },

            plotOptions: {

                pie: {
                    allowPointSelect: true,     // selection d'une part
                    cursor: 'pointer',          // affichage avec pointeur
                }

            },

            series: [{
                data: [
                    { name: 'Open', y: 70.0},
                    { name: 'Close', y: 30.0}
                ]
            }]
        });
    });
});

$(function () {
    $(document).ready(function () {

        $('#cam2').highcharts({

            chart: {
                type: 'pie'
            },

            title: {
                text: 'Windows'
            },

            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,     // selection d'une part
                    cursor: 'pointer',          // affichage avec pointeur
                }
            },
            series: [{
                data: [
                    { name: 'Open', y: 50.0},
                    { name: 'Close', y: 50.0}
                ]
            }]
        });
    });
});

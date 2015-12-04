/**
 * Created by salahbennour on 25/11/2015.
 */

/************************************
 *          VARIABLES               *
 ************************************/

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-05-01 8:00:11';
    endDate = '2015-12-01 18:00:11';
}

var allLoaded = 0;
var finishedLoading = function() {
    if (allLoaded < 5) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
};

var errorOccurred = function() {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};

var doorState = [],
    windowState = [],
    doorPercentage = [],
    windowPercentage = [],
    noiseDoor = [],
    noiseWindow = [];

var successForNoise = function (data) {
    noiseDoor[0] = {"name": "noise", "data": data.data, "yAxis": 1};
    noiseWindow[0] = {"name": "noise", "data": data.data, "yAxis": 1};

    var successForDoorStateInTime = function (data, callback) {
        doorState[0] = {"name": "open",  color: 'rgba(119, 152, 191, .5)' , "data": data.data[0].open};
        doorState[1] = {"name": "close" ,color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close};

        noiseDoor[1] = {"type": 'column', "name" : "door state", "data": data.data[0].open,  "dataGrouping": {
            "enable": false, "force": false}};
        doorGraphStateInTime();

        callback();
    };

    var successForWindowStateInTime = function (data, callback) {
        windowState[0] = {"name": "open",  color: 'rgba(119, 152, 191, .5)' , "data": data.data[0].open};
        windowState[1] = {"name": "close" ,color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close};

        noiseWindow[1] = {"type": 'column', "name" : 'window state', "data": data.data[0].open};
        windowGraphStateInTime();

        callback();
    };

    var toUpdate = false;

    function updateCallback() {
        if (!toUpdate) {
            toUpdate = true;
        }
        else {
            noiseAccordingDoorState();
            noiseAccordingWindowState();
        }
    }

    retrieveData.askForSeriesWithParam('DOOR443STATE/data/splitlist', 'true', beginDate, endDate,
        function (data) {
            successForDoorStateInTime(data, updateCallback);
        }, errorOccurred);

    retrieveData.askForSeriesWithParam('WINDOW443STATE/data/splitlist', 'true', beginDate, endDate,
        function (data) {
            successForWindowStateInTime(data, updateCallback);
        }, errorOccurred);
}



var successForDoorPercentage = function (data) {
    doorPercentage[0] = {"name": "Open", "y": data.data[0].open};
    doorPercentage[1] = {"name": "Close", "y": data.data[1].close};
    doorPercentageCamenbert();
};

var successForWindowPercentage = function (data) {
    windowPercentage[0] = {"name": "Open", "y": data.data[0].open};
    windowPercentage[1] = {"name": "Close", "y": data.data[1].close};
    windowPercentageCamenbert();
};


retrieveData.askForSeries('NOISE_SPARKS_CORRIDOR/data', beginDate, endDate, successForNoise, errorOccurred);
retrieveData.askForSeries('DOOR443STATE/data/percent', beginDate, endDate, successForDoorPercentage, errorOccurred);
retrieveData.askForSeries('WINDOW443STATE/data/percent', beginDate, endDate, successForWindowPercentage, errorOccurred);


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
    finishedLoading();
};


var windowGraphStateInTime = function() {
    $('#g2').highcharts('StockChart', {

        chart: {
            type: 'scatter',
            zoomType: 'x'
        },

        title: {
            text: 'Windows status in time '
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

        series : windowState
    });
    finishedLoading();
};



/**
 * Graphe intensité sonore
 */

var noiseAccordingDoorState = function() {

    $('#c1').highcharts('StockChart', {

        // titre
        title: {
            text: 'Intensité sonore par rapport à la porte'
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
                    value: 45,
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
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        series: [ noiseDoor[0], noiseDoor[1]]
    });
    finishedLoading();
};


var noiseAccordingWindowState = function() {

    $('#c2').highcharts('StockChart', {

        // titre
        title : {
            text : 'Intensité sonore par rapport à la fenêtre'
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
                    value: 45,
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

        series: [ noiseWindow[0], noiseWindow[1]]

    });
    finishedLoading();
};


/**
 * Camenbert état de la porte/fenêtre
 */

var doorPercentageCamenbert = function() {

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
                cursor: 'pointer'          // affichage avec pointeur
            }
        },

        series: [{
            data: [doorPercentage[0],doorPercentage[1]]
        }]
    });
    finishedLoading();
};


var windowPercentageCamenbert = function() {

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
            data: [windowPercentage[0],windowPercentage[1]]
        }]
    });
    finishedLoading();
};

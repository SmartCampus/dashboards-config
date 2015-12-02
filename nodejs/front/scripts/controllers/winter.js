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
    temperaturesArray[0] = {"name": "inside temparature", "data": data.data};
    callback();
};

var secondSuccessInTemp = function (data, callback) {
    temperaturesArray[1] = {"name": "outside temparature", "data": data.data};
    callback();
};

var toUpdate = false;

function update(){
    if(!toUpdate){
        toUpdate = true;
    }else{
        drawLineChart();
    }
}

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate,
    function(data){
        firstSuccessInTemp(data, update)
    }
);

retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate,
    function(data) {
        secondSuccessInTemp(data, update);
    }
);




var drawLineChart = function() {

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
/**
 * Created by Garance on 30/11/2015.
 */

/** The dashboard parametres **/
if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}


var everyBody = 0;

function waitForEverybody() {
    if (everyBody < 2) {
        everyBody += 1;
    }
    else {
        eval(lineChartData);
        everyBody = 0;
    }
}


var temperaturesArray = [];
var lineChartData;

var firstSuccessInTemp = function (data) {
    temperaturesArray[0] = {"name": "inside temparature", "data": data.data};
    console.log('in 1st success for temp');
    waitForEverybody();
};

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate, firstSuccessInTemp);

var secondSuccessInTemp = function (data) {
    temperaturesArray[1] = {"name": "outside temparature", "data": data.data};
    console.log('in 2nd success for temp');
    waitForEverybody();
};
//We need to get the outside temperatures now, to build our whole graph.
retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate, secondSuccessInTemp);

generate.widgetLine(function(data) {
    lineChartData = data;
    waitForEverybody();
});




var barChartData;
var theOthers = 0;
function waitForTheOthers() {
    if (theOthers < 2) {
        theOthers += 1;
    }
    else {
        eval(barChartData);
        theOthers = 0;
    }
}

var countingArray = [];
var successForWindowCount = function (data) {
    countingArray[0] = {"name": "nb of window openings", "data": data.data};
    waitForTheOthers();
};

successForAcCount = function (data) {
    countingArray[1] = {"name": "% of time the AC is on", "data": data.data};
    waitForTheOthers();
};
retrieveData.askForSeriesWithParam('AC_443STATE/data', 'true', beginDate, endDate, successForAcCount);

retrieveData.askForSeriesWithParam('WINDOW443STATE/data', 'true', beginDate, endDate, successForWindowCount);

generate.widgetBar(function(data) {
    barChartData = data;
    waitForTheOthers();
});




var successForWindow = function (data) {
    generate.widgetBoolean("windowState", function(result) {
        eval(result);
    });
};
var successForAC = function (data) {
    generate.widgetBoolean("climState", function(result) {
        eval(result);
    });
};

retrieveData.askForStateNow('WINDOW443STATE', successForWindow);
retrieveData.askForStateNow('AC_443STATE', successForAC);
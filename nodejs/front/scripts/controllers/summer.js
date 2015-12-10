/**
 * Created by Garance on 30/11/2015.
 */

/** The dashboard parametres **/
if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}
var allLoaded = 0;
var finishedLoading = function() {
    if (allLoaded < 3) {
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

var everyBody = 0;
var waitForEverybody = function() {
    if (everyBody < 2) {
        everyBody += 1;
    }
    else {
        finishedLoading();
        eval(lineChartData);
        everyBody = 0;
    }
};


var temperaturesArray = [];
var lineChartData;

var firstSuccessInTemp = function (data) {
    temperaturesArray[0] = {"name": "inside temparature", "data": data.data};
    waitForEverybody();
};

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate, firstSuccessInTemp, errorOccurred);

var secondSuccessInTemp = function (data) {
    temperaturesArray[1] = {"name": "outside temparature", "data": data.data};
    waitForEverybody();
};
//We need to get the outside temperatures now, to build our whole graph.
retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate, secondSuccessInTemp, errorOccurred);

generate.widgetV2("line", [{type:"temperature", "title": "Temperature (°C)"}], "c1", "temperaturesArray", function(data) {
   // console.log(data);
    lineChartData = data;
    waitForEverybody();
}, errorOccurred);


var barChartData;
var theOthers = 0;
function waitForTheOthers() {
    if (theOthers < 2) {
        theOthers += 1;
    }
    else {
        finishedLoading();
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
retrieveData.askForSeriesWithParam('AC_443STATE/data', 'true', beginDate, endDate, successForAcCount, errorOccurred);

retrieveData.askForSeriesWithParam('WINDOW443STATE/data', 'true', beginDate, endDate, successForWindowCount, errorOccurred);
//generate.widgetV2("line", [{type:"temperature", "title": "Temperature (°C)"}], "c1", "temperatureArray", function(data) {

generate.widgetV2("column",  [{"type":"number","title":"Nb of times the window got opened"},{"type":"percent","title":"% of time AC is on"}]
    , "c2", "countingArray", function(data) {
     //   console.log(data);
    barChartData = data;
    waitForTheOthers();
}, errorOccurred);




var successForWindow = function (data) {
    generate.widgetBoolean("windowState", function(result) {
        finishedLoading();
        console.log('*********');
        console.log(result);
        eval(result);
    }, errorOccurred);
};
var successForAC = function (data) {
    generate.widgetBoolean("climState", function(result) {
        finishedLoading();
        console.log('*********');
        console.log(result);
        eval(result);
    }, errorOccurred);
};

retrieveData.askForStateNow('WINDOW443STATE', successForWindow, errorOccurred);
retrieveData.askForStateNow('AC_443STATE', successForAC, errorOccurred);
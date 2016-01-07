/**
 * Created by Garance on 05/01/2016.
 */
var existingPositions = ['right1', 'left1', 'right2', 'left2', 'right3', 'left3' ];

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

var lineChartActors = 0;
var waitForLineChartDrawing = function() {
    if (lineChartActors < 2) {
        lineChartActors += 1;
    }
    else {
        finishedLoading();
        eval(lineChartData);
        lineChartActors = 0;
    }
};


var temperaturesArray = [];
var lineChartData;

var firstSuccessInTemp = function (data) {
    temperaturesArray[0] = {"name": "inside temparature", "data": data.data};
    waitForLineChartDrawing();
};

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate, firstSuccessInTemp, errorOccurred);

var secondSuccessInTemp = function (data) {
    temperaturesArray[1] = {"name": "outside temparature", "data": data.data};
    waitForLineChartDrawing();
};
//We need to get the outside temperatures now, to build our whole graph.
retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate, secondSuccessInTemp, errorOccurred);


var barChartData;
var barChartActors = 0;
function waitForBarChartDrawing() {
    if (barChartActors < 2) {
        barChartActors += 1;
    }
    else {
        finishedLoading();
        eval(barChartData);
        barChartActors = 0;
    }
}

var countingArray = [];
var successForWindowCount = function (data) {
    countingArray[0] = {"name": "nb of window openings", "data": data.data};
    waitForBarChartDrawing();
};

successForAcCount = function (data) {
    countingArray[1] = {"name": "% of time the AC is on", "data": data.data};
    waitForBarChartDrawing();
};
retrieveData.askForSeriesWithParam('AC_443STATE/data', 'true', beginDate, endDate, successForAcCount, errorOccurred);

retrieveData.askForSeriesWithParam('WINDOW443STATE/data', 'true', beginDate, endDate, successForWindowCount, errorOccurred);

var layoutChosen = function(layoutHTML) {
    //layout insertion
    var div = document.getElementById( 'dashboard' );
    div.insertAdjacentHTML( 'afterbegin', layoutHTML );
    console.log(document.cookie);
    generate.widgetV2("Title not defined", allTheNeeds[0]['graphType'],
        [{"type":"number","title":"Nb of times the window got opened"},
            {"type":"percent","title":"% of time AC is on"}]
        , existingPositions[2], "countingArray", function(data) {
            barChartData = data;
            waitForBarChartDrawing();
        }, errorOccurred);

    //widget generation
  /*  generate.widgetV2("Window openings and AC use", "column",
        [{"type":"number","title":"Nb of times the window got opened"},
            {"type":"percent","title":"% of time AC is on"}]
        , "right2", "countingArray", function(data) {
            barChartData = data;
            waitForBarChartDrawing();
        }, errorOccurred);
*/
    generate.widgetV2("Inside and outside temperatures", "line",
        [{type:"temperature", "title": "Temperature (°C)"}], "left2", "temperaturesArray", function(data) {
        lineChartData = data;
        waitForLineChartDrawing();
    }, errorOccurred);

    generate.widgetBoolean("left1", "windowState", "Window", function(result) {
        windowStateData = result;
        waitForWindowStateDrawing()
    }, errorOccurred);

    generate.widgetBoolean("right1", "climState", "Air Conditioning", function(result) {
        finishedLoading();
        acStateData = result;
        waitForAcStateDrawing();
    }, errorOccurred);

};



var windowStateData;
var windowStateActors = 0;
function waitForWindowStateDrawing() {
    if (windowStateActors < 1) {
        windowStateActors += 1;
    }
    else {
        finishedLoading();
        eval(windowStateData);
        windowStateActors = 0;
    }
}


var windowState;
var climState;
var successForWindow = function (data) {
    windowState = data;
    waitForWindowStateDrawing();
};


var acStateData;
var acStateActors = 0;
function waitForAcStateDrawing() {
    if (acStateActors < 1) {
        acStateActors += 1;
    }
    else {
        finishedLoading();
        eval(acStateData);
        acStateActors = 0;
    }
}


var successForAC = function (data) {
    climState = data;
    waitForAcStateDrawing();
};

retrieveData.askForStateNow('WINDOW443STATE', successForWindow, errorOccurred);
retrieveData.askForStateNow('AC_443STATE', successForAC, errorOccurred);
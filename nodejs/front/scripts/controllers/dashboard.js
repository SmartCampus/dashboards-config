/**
 * Created by Garance on 05/01/2016.
 */
var existingPositions = ['right1', 'left1', 'right2', 'left2', 'right3', 'left3' ];

var theNeeds = JSON.parse(localStorage.getItem("bar"));
//localStorage.removeItem("bar");
console.log(theNeeds);

//TODO: demander à l'utilisateur les dates qu'il veut
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
    temperaturesArray[0] = {"name": "inside temperature", "data": data.data};
    waitForLineChartDrawing();
};
var secondSuccessInTemp = function (data) {
    temperaturesArray[1] = {"name": "outside temperature", "data": data.data};
    waitForLineChartDrawing();
};
//We're asking for the first widget data, that we "know" is NOT a boolean, and we only need regular series
//We also "know" that there are precisely 2 sensors from which we need to retrieve data !
//TODO: if we have a loop, how do we know to which success callback we should go ?
retrieveData.askForSeries(theNeeds[0]['sensors'][1]+'/data', beginDate, endDate, firstSuccessInTemp, errorOccurred);
retrieveData.askForSeries(theNeeds[0]['sensors'][0]+'/data', beginDate, endDate, secondSuccessInTemp, errorOccurred);




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
retrieveData.askForSeriesWithParam(theNeeds[1]['sensors'][0]+'/data', 'true', beginDate, endDate, successForAcCount, errorOccurred);

retrieveData.askForSeriesWithParam(theNeeds[1]['sensors'][1]+'/data', 'true', beginDate, endDate, successForWindowCount, errorOccurred);

var layoutChosen = function(layoutHTML) {
    //layout insertion
    var div = document.getElementById( 'dashboard' );
    div.insertAdjacentHTML( 'afterbegin', layoutHTML );

    //This is the second graph, comparing window & ac time on
    generate.widgetV2("Title not defined", theNeeds[1]['graphType'],
        [{"type":"number","title":"Nb of times the window got opened"},
            {"type":"percent","title":"% of time AC is on"}]
        , existingPositions[2], "countingArray", function(data) {
            barChartData = data;
            waitForBarChartDrawing();
        }, errorOccurred);

    //This is the first graph, comparing tempartures
    generate.widgetV2("Title not defined", theNeeds[0]['graphType'],
        [{type:"temperature", "title": "Temperature (°C)"}]
        , existingPositions[3], "temperaturesArray", function(data) {
            lineChartData = data;
            waitForLineChartDrawing();
        }, errorOccurred);

    generate.widgetBoolean( existingPositions[1], "windowState", "Window", function(result) {
        windowStateData = result;
        waitForWindowStateDrawing()
    }, errorOccurred);

    generate.widgetBoolean( existingPositions[0], "climState", "Air Conditioning", function(result) {
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

retrieveData.askForStateNow(theNeeds[2]['sensors'][0], successForWindow, errorOccurred);
retrieveData.askForStateNow(theNeeds[3]['sensors'][0], successForAC, errorOccurred);
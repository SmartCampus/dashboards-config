/**
 * Created by Garance on 05/01/2016.
 */
var existingPositions = ['right1', 'left1', 'right2', 'left2', 'right3', 'left3' ];

var theNeeds = JSON.parse(localStorage.getItem("bar"));

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}

var sensorDataRetrievingSuccess = function (data, sensor) {
    console.log('***********************');
    console.log(sensor);
    firstWidgetData.push({"name": sensor.title, "data": data.data});
    waitForLineChartDrawing();
};

var errorOccurred = function() {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};


//Quick and dirty definition !
theNeeds.forEach(function(aNeed) {
    //Besoin de connaître le type de graphe pour savoir la route exacte que je vais demander à SC.
    if (aNeed.graphType == 'line') {
        //Si tu veux un ligne, ben du coup je demande des data
        aNeed.scRoute = '/data';
    }

    //Maintenant que je sais ça, pour chaque sensor : je récup les infos manquantes, & j'appelle les données.
    aNeed.sensors.forEach(function(sensor) {
        if (sensor.name == "TEMP_CAMPUS") {
            sensor.unit= "temperature";
            sensor.title="Outside Temperature";
        }
        else if (sensor.name == "TEMP_443V") {
            sensor.unit= "temperature";
            sensor.title="Inside Temperature";
        }
        else {
            console.log('jai pas compris le capteur que tu voulais');
        }
        //The service could provide me with the info I will lack ! eg. everything i just gathered...
        console.log(sensor.name+aNeed.scRoute);
        retrieveData.askForSeries(sensor.name+ aNeed.scRoute, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor);
    });
    console.log(aNeed);
});


localStorage.removeItem("bar");
console.log(theNeeds);

//TODO: demander à l'utilisateur les dates qu'il veut

var allLoaded = 0;
var finishedLoading = function() {
    if (allLoaded < theNeeds.length - 1) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
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


var firstWidgetData = [];
var lineChartData;


var secondSuccessInTemp = function (data) {
    firstWidgetData[1] = {"name": "outside temperature", "data": data.data};
    waitForLineChartDrawing();
};
//We're asking for the first widget data, that we "know" is NOT a boolean, and we only need regular series
//We also "know" that there are precisely 2 sensors from which we need to retrieve data !
//TODO: if we have a loop, how do we know to which success callback we should go ?





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
//retrieveData.askForSeriesWithParam(theNeeds[1]['sensors'][0]+'/data', 'true', beginDate, endDate, successForAcCount, errorOccurred);

//retrieveData.askForSeriesWithParam(theNeeds[1]['sensors'][1]+'/data', 'true', beginDate, endDate, successForWindowCount, errorOccurred);

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
    //TODO: dans la generation, si je dis type = temperature, tu devines le titre.
    generate.widgetV2("Title not defined", theNeeds[0]['graphType'],
        [{type:"temperature", "title": "Temperature (°C)"}]
        , existingPositions[3], "firstWidgetData", function(data) {
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

//retrieveData.askForStateNow(theNeeds[2]['sensors'][0], successForWindow, errorOccurred);
//retrieveData.askForStateNow(theNeeds[3]['sensors'][0], successForAC, errorOccurred);
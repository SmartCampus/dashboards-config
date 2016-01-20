/**
 * Created by salahbennour on 25/11/2015.
 */

/************************************
 *          VARIABLES               *
 ************************************/

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-10-01 8:00:11';
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

        noiseDoor[1] = {"name" : "door opened", "data": data.data[0].open,  "dataGrouping": {
            "enable": false, "force": false}};
        doorGraphStateInTime();

        callback();
    };

    var successForWindowStateInTime = function (data, callback) {
        //scatter needs these 2 objects
        windowState[0] = {"name": "open",  color: 'rgba(119, 152, 191, .5)' , "data": data.data[0].open};
        windowState[1] = {"name": "close", color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close};

        noiseWindow[1] = {"name" : 'window opened', "data": data.data};
        //calls scatter at the same time
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
};



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
    generate.widgetV2("Door status over time", "scatter", "", "g1", "doorState", function(data) {
        eval(data);
    }, errorOccurred);

    finishedLoading();
};


var windowGraphStateInTime = function() {
    generate.widgetV2("Window status over time", "scatter", "", "g2", "windowState", function(data) {
        eval(data);
    }, errorOccurred);
    finishedLoading();
};



/**
 * Graphe intensité sonore
 */

var noiseAccordingDoorState = function() {
    //ici, on ne donne pas de type au moteur de génération = graphe mixte !
    generate.widgetV2("Loudness in function of the door", "",
        [
            { "type": "decibel", "title": "loudness" },
            { "type": "number", "title": "Nb of times the door got opened" }
        ]
        , "c1", "noiseDoor", function(data) {
        eval(data);
    }, errorOccurred);
    finishedLoading();
};


var noiseAccordingWindowState = function() {

    generate.widgetV2("Loudness in function of the door", "",
        [
            { "type": "decibel", "title": "loudness" },
            { "type": "number", "title": "Nb of times the window got opened" }
        ]
        , "c2", "noiseWindow", function(data) {
            eval(data);
        }, errorOccurred);
    finishedLoading();
};


/**
 * Camenbert état de la porte/fenêtre
 */

var doorPercentageCamenbert = function() {

    generate.widgetPie("cam1", "Door", "doorPercentage", function(data) {
        eval (data);
    }, errorOccurred);
    finishedLoading();
};


var windowPercentageCamenbert = function() {
    generate.widgetPie("cam2", "Window", "windowPercentage", function(data) {
        eval (data);
    }, errorOccurred);
    finishedLoading();
};

/**
 * Created by Garance on 05/01/2016.
 */
var existingPositions = ['right1', 'left1', 'right2', 'left2', 'right3', 'left3'];

var theNeeds = JSON.parse(localStorage.getItem("bar"));

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}

var sensorDataRetrievingSuccess = function (data, sensor, index) {
    if (index == 0) {
        console.log('first widget');
        firstWidgetData.push({"name": sensor.title, "data": data.data});
        waitForFirstWidgetDrawing(sensor, index);
    }
    else if (index == 1) {
        console.log('second widget');
        secondWidgetData.push({"name": sensor.title, "data": data.data});
        waitForSecondWidgetDrawing(sensor, index);
    }
};

var errorOccurred = function () {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};


//Quick and dirty definition !
theNeeds.forEach(function (aNeed, index) {
    if (aNeed.sensors.length>0) { //we only do that if you asked for some sensors !
        //Besoin de connaître le type de graphe pour savoir la route exacte que je vais demander à SC.
        if (aNeed.graphType == 'line' || aNeed.graphType == 'column') {
            aNeed.scRoute = '/data';
        }
        if (aNeed.graphType == 'column') {
            aNeed.withParam = true;
        }
        //Maintenant que je sais ça, pour chaque sensor : je récup les infos manquantes, & j'appelle les données.
        aNeed.sensors.forEach(function (sensor) {
            if (sensor.name == "TEMP_CAMPUS") {
                sensor.type = "temperature";
                sensor.title = "Outside Temperature";
            }
            else if (sensor.name == "TEMP_443V") {
                sensor.type = "temperature";
                sensor.title = "Inside Temperature";
            }
            else if (sensor.name == "AC_443STATE") {
                sensor.type = "percent";
                sensor.title = "% of time AC is on";
            }
            else if (sensor.name == "WINDOW443STATE") {
                sensor.type = "number";
                sensor.title = "Nb of times the window got opened";
            }
            else {
                console.log('jai pas compris le capteur que tu voulais');
            }
            //The service could provide me with the info I will lack ! eg. everything i just gathered...
            console.log(sensor.name + aNeed.scRoute);
            //then we have to ask for series with a param !!!!
            if (aNeed.withParam) {
                     retrieveData.askForSeriesWithParam(sensor.name + aNeed.scRoute, aNeed.withParam.toString(), beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
            }
            else {
                retrieveData.askForSeries(sensor.name + aNeed.scRoute, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
            }
        });
        console.log(aNeed);
    }
});


localStorage.removeItem("bar");
console.log(theNeeds);

//TODO: demander à l'utilisateur les dates qu'il veut

var allLoaded = 0;
var finishedLoading = function () {
    if (allLoaded < theNeeds.length - 1) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
};

var firstWCode;
var firstWidgetYArray = [];
var waitForFirstWidgetDrawing = function (sensor, index) {
    //TODO: dans la generation, si je dis type = temperature, tu devines le titre.
    //Pour le moment, je mets autre chose du coup c'est pas fou.
    if (firstWidgetYArray.length < theNeeds[index].sensors.length) {
        firstWidgetYArray.push(sensor);
    }
    if (firstWidgetYArray.length == theNeeds[index].sensors.length) {
        generate.widgetV2("Title not defined", theNeeds[index].graphType,
            firstWidgetYArray
            , existingPositions[3], "firstWidgetData", function (data) {
                firstWCode = data;
                eval(firstWCode); //TODO:is this the right place for eval ?
            }, errorOccurred);
    }
};


var firstWidgetData = [];
var secondWidgetData = [];


var secondWCode;
var secondWidgetYArray = [];
var waitForSecondWidgetDrawing = function(sensor, index) {
    if (secondWidgetYArray.length < theNeeds[index].sensors.length) {
        secondWidgetYArray.push(sensor);
    }
    if (secondWidgetYArray.length == theNeeds[index].sensors.length) {
        generate.widgetV2("Title not defined", theNeeds[index]['graphType'],
            secondWidgetYArray
            , existingPositions[2], "secondWidgetData", function (data) {
                secondWCode = data;//TODO:is this the right place for eval ?
                eval(secondWCode);

            }, errorOccurred);
    }
};

var layoutChosen = function (layoutHTML) {
    //layout insertion
    var div = document.getElementById('dashboard');
    div.insertAdjacentHTML('afterbegin', layoutHTML);

    generate.widgetBoolean(existingPositions[1], "windowState", "Window", function (result) {
        windowStateData = result;
        waitForWindowStateDrawing()
    }, errorOccurred);

    generate.widgetBoolean(existingPositions[0], "climState", "Air Conditioning", function (result) {
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
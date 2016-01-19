/**
 * Created by Garance on 05/01/2016.
 */
var existingPositions = ['left2', 'right2', 'right1', 'left1', 'right3', 'left3'];
var theNeeds = JSON.parse(localStorage.getItem("bar"));

if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}


var sensorDataRetrievingSuccess = function (data, sensor, index) {
    //this works only if they are regular widgets.
    //if i want the boolean to work the same way...
    if (theNeeds[index].graphType == 'line' || theNeeds[index].graphType == 'column') {
        console.log('line or column widget');
        firstWidgetData.push({"name": sensor.title, "data": data.data});
        waitForFirstWidgetDrawing(firstWidgetData, sensor, index);
    }
    else if (theNeeds[index].graphType == 'boolean') {
        //then i'm in AC or window !
        console.log('boolean widget !');
        goDrawBoolean(data, sensor, index);
    }
};

var errorOccurred = function () {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};





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
//An array of as many arrays as we have widgets.
var watchingArray = [[], [], [], []];
var waitForFirstWidgetDrawing = function (dataSC, sensor, index) {
    //TODO: dans la generation, si je dis type = temperature, tu devines le titre.
    //Pour le moment, je mets autre chose du coup c'est pas fou.
    if (watchingArray[index].length < theNeeds[index].sensors.length) {
        watchingArray[index].push(sensor);
    }
    if (watchingArray[index].length == theNeeds[index].sensors.length) {
        generate.widgetV2("Title not defined", theNeeds[index].graphType,
            watchingArray[index]
            , existingPositions[index], "dataSC", function (data) {
                firstWCode = data;
                eval(firstWCode); //TODO:is this the right place for eval ?
                finishedLoading();
            }, errorOccurred);
    }
};

var boolCode;
var goDrawBoolean = function (data, sensor, index) {
    generate.widgetBoolean(existingPositions[index], "data", sensor.booleanTitle, function (result) {
        boolCode = result;
        eval(boolCode);
        finishedLoading();
    }, errorOccurred);
};

var firstWidgetData = [];
var secondWidgetData = [];

var layoutChosen = function (layoutHTML) {
    //layout insertion
    var div = document.getElementById('dashboard');
    div.insertAdjacentHTML('afterbegin', layoutHTML);

//Quick and dirty definition !
    theNeeds.forEach(function (aNeed, index) {
        if (aNeed.sensors.length > 0) { //we only do that if you asked for some sensors !
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
                    sensor.booleanTitle = "AC"
                }
                else if (sensor.name == "WINDOW443STATE") {
                    sensor.type = "number";
                    sensor.title = "Nb of times the window got opened";
                    sensor.booleanTitle = "Window"
                }
                else {
                    console.log('jai pas compris le capteur que tu voulais');
                }
                //The service could provide me with the info I will lack ! eg. everything i just gathered...
                //then we have to ask for series with a param !!!!
                if (aNeed.withParam) {
                    retrieveData.askForSeriesWithParam(sensor.name + aNeed.scRoute, aNeed.withParam.toString(), beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
                else if (aNeed.graphType == 'boolean') {
                    retrieveData.askForStateNow(sensor.name, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
                else {
                    retrieveData.askForSeries(sensor.name + aNeed.scRoute, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                }
            });
        }
    });
};
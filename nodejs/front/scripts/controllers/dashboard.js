/**
 * Created by Garance on 05/01/2016.
 */

//Ca, ça va pas du tout. Ca fait que ca dépend de comment t'as rempli tes boites, et c'tout !
var existingPositions = [];
var beginDate='';
var endDate = '';
var watchingArray = [{"dataSC": [], "counter": []}, {"dataSC": [], "counter": []}, {
    "dataSC": [],
    "counter": []
}, {"dataSC": [], "counter": []}];

////////////////////////////// Generic function to fire in case of server error ///////////////////////////////////////
var errorOccurred = function () {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};

////////////////////////////// Retrieving the needs stored from previous page //////////////////////////////////////////
var theNeeds = JSON.parse(localStorage.getItem("widgetsDescription"));
localStorage.removeItem("widgetsDescription");
if (theNeeds === null) {errorOccurred()}
if (localStorage.getItem("dashboardTitle") !== null) {
    $("#theGeneralTitle").html(localStorage.getItem("dashboardTitle"));
} //else we just don't write any title

if (beginDate === '' || endDate == '') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-08-21 18:00:11';
}


var sensorDataRetrievingSuccess = function (data, sensor, index) {
    //this works only if they are regular widgets.
    //if i want the boolean to work the same way...
    if (theNeeds[index].graphType == 'line' || theNeeds[index].graphType == 'column') {
        console.log('line or column widget');
        //TODO:probleme si les callbacks sont pas dans l'ordre que j'imagine là...
        watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
        waitForFirstWidgetDrawing(sensor, index);
    }
    else if (theNeeds[index].graphType == 'boolean') {
        //then i'm in AC or window !
        console.log('boolean widget !');
        goDrawBoolean(data, sensor, index);
    }
    else if (theNeeds[index].graphType == 'pieChart') {
        watchingArray[index].dataSC.push({"name": "Open", "y": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "Close", "y": data.data[1].close});
        goDrawPie(sensor, index);
    }
    else if (theNeeds[index].graphType == 'mix') {
        //in case it's noise
        //It seems we can keep on putting stuff in the watching array. after all....
        if (sensor.unit == "decibel") {
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data, "yAxis": 1});
        } else {
            //in case it's a mix, here is what we want to do with the other result
            //problem : we want ONLY the open result. the name we can use the one we have it's ok
            //not sure we really need the split list for a mix... the open though i guess i needed
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
        }
        waitForFirstWidgetDrawing(sensor, index);
        //TODO: wait for other drawings !
    }
    else if (theNeeds[index].graphType == 'scatterplot') {
        //this is what happens to the data we get from a split, for a scatterplot
        //as far as we know, the only times we want a scatter is to see open or closed doors
        watchingArray[index].dataSC.push({"name": "open", color: 'rgba(119, 152, 191, .5)', "data": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "close", color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close});
        goDrawScatterPlot(index); //For now at least, it seems that a scatter plot only has one data, so that's that.
    }
};


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
var waitForFirstWidgetDrawing = function (sensor, index) {
    if (watchingArray[index].counter.length < theNeeds[index].sensors.length) {
        watchingArray[index].counter.push(sensor);
    }//TODO: pour le moment, on push des sensors à la place des yaxes : dans le cas de winter ça va plus être possible...
    if (watchingArray[index].counter.length == theNeeds[index].sensors.length) {
        /*
         generate.widgetV2("Loudness in function of the door", "",
         [
         { "type": "decibel", "title": "loudness" },
         { "type": "number", "title": "Nb of times the door got opened" }
         ]
         , "c1", "noiseDoor", function(data) {
         */
        if (theNeeds[index].graphType == "mix") {
            theNeeds[index].graphType = "";
        }//TODO: test ça
        generate.widgetV2(theNeeds[index].title, theNeeds[index].graphType,
            watchingArray[index].counter
            , existingPositions[index], "watchingArray[index].dataSC", function (data) {
                firstWCode = data;
                eval(firstWCode); //TODO:is this the right place for eval ?
                finishedLoading();
            }, errorOccurred);
    }
};

var goDrawScatterPlot = function(index) {
        generate.widgetV2(theNeeds[index].title, "scatter", "",existingPositions[index],
            "watchingArray[index].dataSC", function (data) {
            console.log(data);
            eval(data); //TODO:is this the right place for eval ?
            finishedLoading();
        }, errorOccurred);
};

var boolCode;
var goDrawBoolean = function (data, sensor, index) {
    generate.widgetBoolean(existingPositions[index], "data", sensor.booleanTitle, function (result) {
        boolCode = result;
        eval(boolCode);
        finishedLoading();
    }, errorOccurred);
};

var goDrawPie = function (sensor, index) {
    generate.widgetPie(existingPositions[index], sensor.booleanTitle, "watchingArray[index].dataSC", function (data) {
        eval(data);
        finishedLoading();
    }, errorOccurred);
};

var layoutChosen = function (layoutName, layoutAnswer) {
    //layout insertion
    var div = document.getElementById('dashboard');

    //After getting the layout generated, the same server has to give us the list of the div ids it created.
    layouts.widgetsIds(layoutName, function (widgetsArray) {
        console.log(widgetsArray);
        existingPositions = widgetsArray;
        div.insertAdjacentHTML('afterbegin', layoutAnswer);

        theNeeds.forEach(function (aNeed, index) {
            if (aNeed.sensors.length > 0) { //we only do that if you asked for some sensors !
                //Besoin de connaître le type de graphe pour savoir la route exacte que je vais demander à SC.
                aNeed.additionnal = '';

                if (aNeed.graphType == 'line' || aNeed.graphType == 'column' || aNeed.graphType == 'mix'
                    || aNeed.graphType == 'pieChart' || aNeed.graphType == 'scatterplot') {
                    aNeed.scRoute = '/data';
                }
                if (aNeed.graphType == 'column') {
                    aNeed.withParam = true;
                }
                if (aNeed.graphType == 'mix' || aNeed.graphType == 'scatterplot') {
                    aNeed.additionnal = '/splitlist';
                    aNeed.withParam = true;
                }
                if (aNeed.graphType == 'pieChart') {
                    aNeed.additionnal = '/percent';
                }
                //Maintenant que je sais ça, pour chaque sensor : je récup les infos manquantes, & j'appelle les données.
                aNeed.sensors.forEach(function (sensor) {
                    if (sensor.name == "NOISE_SPARKS_CORRIDOR") {
                        //The other elements of a mix graph will require splitdata and all, but not him...
                        retrieveData.askForSeries(sensor.name + aNeed.scRoute, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    if (sensor.percent) {
                        console.log('hé tas dit percent');
                        sensor.unit = 'percent';
                        sensor.description = '% of ' + sensor.description;
                    }
                    //The service could provide me with the info I will lack ! eg. everything i just gathered...
                    //then we have to ask for series with a param !!!!

                    if (aNeed.withParam) {
                        retrieveData.askForSeriesWithParam(sensor.name + aNeed.scRoute + aNeed.additionnal, aNeed.withParam.toString(), beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else if (aNeed.graphType == 'boolean') {
                        retrieveData.askForStateNow(sensor.name, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else {
                        retrieveData.askForSeries(sensor.name + aNeed.scRoute + aNeed.additionnal, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                });
            }
        });

    }, errorOccurred);

};
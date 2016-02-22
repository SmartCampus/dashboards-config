/**
 * Created by Garance on 05/01/2016.
 */

//Ca, ça va pas du tout. Ca fait que ca dépend de comment t'as rempli tes boites, et c'tout !
var existingPositions = [];
var beginDate='';
var endDate = '';
var watchingArray = [{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []},{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []},{"dataSC": [], "counter": []}];

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
    beginDate = '2015-08-21 8:00:11';
    endDate = '2015-10-21 18:00:11';
}


var sensorDataRetrievingSuccess = function (data, sensor, index) {
    if (theNeeds[index].graphType == 'line' || theNeeds[index].graphType == 'column') {
        console.log('line or column widget');
        //TODO:probleme si les callbacks sont pas dans l'ordre que j'imagine là...
        watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
        waitForOtherSensorsToDraw(sensor, index);
    }
    else if (theNeeds[index].graphType == 'boolean') {
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

            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data[0].open});

            //watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
        console.log('in callback from data mix graph');
        console.log(watchingArray[index].dataSC);
        }
        waitForOtherSensorsToDraw(sensor, index);
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
var waitForOtherSensorsToDraw = function (sensor, index) {
    if (watchingArray[index].counter.length < theNeeds[index].sensors.length) {
        console.log('for ', index, ' i havent found everything yet');
        watchingArray[index].counter.push(sensor);
    }//TODO: pour le moment, on push des sensors à la place des yaxes : dans le cas de winter ça va plus être possible...
    if (watchingArray[index].counter.length == theNeeds[index].sensors.length) {
        console.log('for ', index, 'i have everything');
        if (theNeeds[index].graphType == "mix") {
            console.log('the graph type is mix, im deleting that');
            theNeeds[index].graphType = "";
        }
        console.log(watchingArray[index].dataSC);
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
    generate.widgetBoolean(existingPositions[index], "data", theNeeds[index].title, function (result) {
        boolCode = result;
        eval(boolCode);
        finishedLoading();
    }, errorOccurred);
};

var goDrawPie = function (sensor, index) {
    generate.widgetPie(existingPositions[index], theNeeds[index].title, "watchingArray[index].dataSC", function (data) {
        eval(data);
        finishedLoading();
    }, errorOccurred);
};

var layoutChosen = function (layoutName, layoutAnswer) {
    //layout insertion
    var div = document.getElementById('dashboard');

    //After getting the layout generated, the same server has to give us the list of the div ids it created.
    layouts.widgetsIds(layoutName, function (widgetsArray) {
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

                    if (sensor.percent) {
                        console.log('hé tas dit percent');
                        sensor.unit = 'percent';
                        sensor.description = '% of ' + sensor.description;
                    }
                    //The service could provide me with the info I will lack ! eg. everything i just gathered...
                    //then we have to ask for series with a param !!!!
                    if (sensor.name == "NOISE_SPARKS_CORRIDOR") {
                        //The other elements of a mix graph will require splitdata and all, but not him...
                        retrieveData.askForSeries(sensor.name + aNeed.scRoute, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else if (aNeed.withParam) {
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
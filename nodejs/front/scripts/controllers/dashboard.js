/**
 * Created by Garance on 05/01/2016.
 */

//Ca, ça va pas du tout. Ca fait que ca dépend de comment t'as rempli tes boites, et c'tout !
var existingPositions = [];
<<<<<<< HEAD

var watchingArray = [{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []},{"dataSC": [], "counter": []},{"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []},{"dataSC": [], "counter": []}];
=======
var beginDate = '';
var endDate = '';
var watchingArray = [{"dataSC": [], "counter": []}, {"dataSC": [], "counter": []}, {"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []}, {"dataSC": [], "counter": []}, {"dataSC": [], "counter": []},
    {"dataSC": [], "counter": []}, {"dataSC": [], "counter": []}];
>>>>>>> getSensorsByNeeds

////////////////////////////// Generic function to fire in case of server error ///////////////////////////////////////
var errorOccurred = function () {
    document.getElementById("errorOccurred").className = "row text-center show";
    document.getElementById("loadingImg").className = "hidden";
    document.getElementById("dashboard").className = "hidden";
};

var loadingGif = $(document.createElement('img'));
loadingGif.attr("src", "/assets/images/loading.gif");
var okGlyph = $(document.createElement('span'));
okGlyph.attr("class", "glyphicon glyphicon-ok");

////////////////////////////// Retrieving the needs stored from previous page //////////////////////////////////////////
<<<<<<< HEAD
var theNeeds = JSON.parse(localStorage.getItem("widgetsDescription"));
beginDate = localStorage.getItem("startDate");
endDate = localStorage.getItem("endDate");
=======
var allWidgets = JSON.parse(localStorage.getItem("widgetsDescription"));
>>>>>>> getSensorsByNeeds
localStorage.removeItem("widgetsDescription");
if (allWidgets === null) {
    errorOccurred()
}
if (localStorage.getItem("dashboardTitle") !== null) {
    $("#theGeneralTitle").html(localStorage.getItem("dashboardTitle"));
} //else we just don't write any title

<<<<<<< HEAD
if (beginDate == 'undefined' || endDate == 'undefined') {
    beginDate = '2015-08-21 8:00:11';
    endDate = '2015-10-21 18:00:11';
=======
if (beginDate === '' || endDate == '') {
//    beginDate = '2015-07-21 8:00:11';
//    endDate = '2015-09-21 18:00:11';
    beginDate = '2015-12-21 8:00:11';
    endDate = '2016-01-21 18:00:11';
>>>>>>> getSensorsByNeeds
}


var sensorDataRetrievingSuccess = function (data, sensor, index) {
<<<<<<< HEAD
    $("#loadingSensor"+sensor.name+index).html("Data for \""+sensor.displayName +"\" for the widget \""+theNeeds[index].title+"\" is successfully retrieved ! ");

    if (theNeeds[index].graphType == 'line' || theNeeds[index].graphType == 'column') {
        console.log('line or column widget');
        //TODO:probleme si les callbacks sont pas dans l'ordre que j'imagine là...
        watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
=======
    if (allWidgets[index].graphType == 'line' || allWidgets[index].graphType == 'column' || allWidgets[index].graphType == 'mix') {
        if (sensor.unit == "decibel") {
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data, "yAxis": 1});
        } else if (sensor.name == "DOOR443STATE" || sensor.name == "WINDOW443STATE") { //oops c'est sale
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data[0].open});
        }
        else {
            watchingArray[index].dataSC.push({"name": sensor.description, "data": data.data});
        }
>>>>>>> getSensorsByNeeds
        waitForOtherSensorsToDraw(sensor, index);
    }
    else if (allWidgets[index].graphType == 'boolean') {
        goDrawBoolean(data, sensor, index);
    }
    else if (allWidgets[index].graphType == 'pieChart') {
        watchingArray[index].dataSC.push({"name": "Open", "y": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "Close", "y": data.data[1].close});
        goDrawPie(sensor, index);
    }
    else if (allWidgets[index].graphType == 'scatterplot') {
        //this is what happens to the data we get from a split, for a scatterplot
        //as far as we know, the only times we want a scatter is to see open or closed doors
        watchingArray[index].dataSC.push({"name": "open", color: 'rgba(119, 152, 191, .5)', "data": data.data[0].open});
        watchingArray[index].dataSC.push({"name": "close", color: 'rgba(223, 83, 83, .5)', "data": data.data[1].close});
        goDrawScatterPlot(index);
    }
};


//TODO: demander à l'utilisateur les dates qu'il veut

var allLoaded = 0;
var finishedLoading = function () {
    if (allLoaded < allWidgets.length - 1) {
        allLoaded += 1;
    }
    else {
        document.getElementById("loadingImg").className = "hidden";
    }
};

//An array of as many arrays as we have widgets.
var waitForOtherSensorsToDraw = function (sensor, index) {
<<<<<<< HEAD
    if (watchingArray[index].counter.length < theNeeds[index].sensors.length) {
        console.log('for ', index, ' i havent found everything yet');
        watchingArray[index].counter.push(sensor);
    }//TODO: pour le moment, on push des sensors à la place des yaxes : dans le cas de winter ça va plus être possible...
    if (watchingArray[index].counter.length == theNeeds[index].sensors.length) {
        $("#loadingNeed"+index).html(" Starting the widget \""+theNeeds[index].title+"\" graph generation... ");
=======
    if (watchingArray[index].dataSC.length <= allWidgets[index].sensors.length) {
        console.log('unit of current : ', sensor.unit);

        if (watchingArray[index].counter.length > 0 && watchingArray[index].counter[0].unit == sensor.unit) {
            console.log('unit of 0 : ', watchingArray[index].counter[0].unit);
            watchingArray[index].counter[0].amount += 1;
        }
        else if (watchingArray[index].counter.length > 1 && watchingArray[index].counter[1].unit == sensor.unit) {
            console.log('unit of 1 : ', watchingArray[index].counter[1].unit);
            watchingArray[index].counter[1].amount += 1;
        }
        else {
            console.log('we push a ', sensor.unit);
            watchingArray[index].counter.push({
                "unit": sensor.unit,
                "title": sensor.unit,
                "amount": 1
            });
        }
        console.log('nb of y axes : ', watchingArray[index].counter.length);
    }
    if (watchingArray[index].dataSC.length == allWidgets[index].sensors.length) {
>>>>>>> getSensorsByNeeds
        console.log('for ', index, 'i have everything');
        if (allWidgets[index].graphType == "mix") {
            allWidgets[index].graphType = "";
        }
        console.log(watchingArray[index].dataSC);
        generate.widgetV2(allWidgets[index].title, allWidgets[index].graphType,
            watchingArray[index].counter
            , existingPositions[index], "watchingArray[index].dataSC", function (data) {
<<<<<<< HEAD
                $("#loadingNeed"+index).html("The widget \""+theNeeds[index].title+"\" graph is generated ! ");

                firstWCode = data;
                eval(firstWCode); //TODO:is this the right place for eval ?
=======
                eval(data);
>>>>>>> getSensorsByNeeds
                finishedLoading();
            }, errorOccurred);
    }
};

var goDrawScatterPlot = function (index) {
    generate.widgetV2(allWidgets[index].title, "scatter", "", existingPositions[index],
        "watchingArray[index].dataSC", function (data) {
            eval(data);
            finishedLoading();
        }, errorOccurred);
};

var goDrawBoolean = function (data, sensor, index) {
    generate.widgetBoolean(existingPositions[index], "data", allWidgets[index].title, function (result) {
        eval(result);
        finishedLoading();
    }, errorOccurred);
};

var goDrawPie = function (sensor, index) {
    generate.widgetPie(existingPositions[index], allWidgets[index].title, "watchingArray[index].dataSC", function (data) {
        eval(data);
        finishedLoading();
    }, errorOccurred);
};

var layoutChosen = function (layoutName, layoutAnswer) {
    //layout insertion

    var loadingLayoutDiv = $(document.createElement('div'));
    loadingLayoutDiv.attr("id", "loadingLayout");
    loadingLayoutDiv.html("The layout is being generated...");
    loadingLayoutDiv.appendTo($("#loadingImg"));

    var div = document.getElementById('dashboard');

    //After getting the layout generated, the same server has to give us the list of the div ids it created.
    layouts.widgetsIds(layoutName, function (widgetsArray) {

        loadingLayoutDiv.html("The layout is generated !");

        existingPositions = widgetsArray;
        div.insertAdjacentHTML('afterbegin', layoutAnswer);
        var loadingDataGeneral = $(document.createElement('div'));
        loadingDataGeneral.attr("id", "loadingDataGeneral");
        loadingDataGeneral.appendTo($("#loadingImg"));
        loadingDataGeneral.html("The data you requested is being loaded...");


<<<<<<< HEAD
        theNeeds.forEach(function (aNeed, index) {
            var loadingANeed = $(document.createElement('div'));
            loadingANeed.attr("id", "loadingNeed"+index);
            loadingANeed.appendTo($("#loadingImg"));
            loadingANeed.html("The widget called \""+aNeed.title+"\" is being loaded...");

            if (aNeed.sensors.length > 0) { //we only do that if you asked for some sensors !
                //Besoin de connaître le type de graphe pour savoir la route exacte que je vais demander à SC.
                aNeed.additionnal = '';
                if (aNeed.graphType == 'line' || aNeed.graphType == 'column' || aNeed.graphType == 'mix'
                    || aNeed.graphType == 'pieChart' || aNeed.graphType == 'scatterplot') {
                    aNeed.scRoute = '/data';
                }
                if (aNeed.graphType == 'column') {
                    aNeed.withParam = true;
=======
        allWidgets.forEach(function (widget, index) {
            if (widget.sensors.length > 0) { //we only do that if you asked for some sensors !
                widget.additionnal = '';
                if (widget.graphType == 'column' || widget.graphType == 'scatterplot') {
                    widget.withParam = true;
>>>>>>> getSensorsByNeeds
                }
                if (widget.graphType == 'scatterplot') {
                    widget.additionnal = '/splitlist';
                }
                if (widget.graphType == 'pieChart') {
                    widget.additionnal = '/percent';
                }
                //Maintenant que je sais ça, pour chaque sensor : je récup les infos manquantes, & j'appelle les données.
<<<<<<< HEAD
                aNeed.sensors.forEach(function (sensor) {
                    var loadingASensor = $(document.createElement('div'));
                    loadingASensor.attr("id", "loadingSensor"+sensor.name+index);
                    loadingASensor.appendTo($("#loadingImg"));
                    loadingASensor.html("The sensor called \""+sensor.displayName +"\" for the widget \""+aNeed.title+"\" is loading...");
=======
                widget.sensors.forEach(function (sensor) {
                    widget.withParam = false;
>>>>>>> getSensorsByNeeds
                    if (sensor.percent) {
                        sensor.unit = 'percent';
                        sensor.description = '% of ' + sensor.description;
                        widget.withParam = true;
                    }
                    //Je veux splitlist dans le cas d'une porte ou d'une fenêtre : ce sera sans doute dans le cas de
                    // n'importe quelle porte ou fenêtre, en fait -> il me faudrait bien un kind là...
                    //Je ne peux pas dire quand j'ai STATE, parce que heating par exemple, c'est un state aussi
                    //et je veux param mais pas state
                    //pourquoi pas true quand j'ai un state ?
                    if (sensor.name == "DOOR443STATE" || sensor.name == "WINDOW443STATE") {
                        widget.additionnal = '/splitlist';
                        widget.withParam = true;
                    }
                    else if (sensor.name == "HEATING_443") {
                        widget.withParam = true;
                    }
                    if (widget.graphType == 'boolean') {
                        retrieveData.askForStateNow(sensor.name, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else if (widget.withParam) {
                        retrieveData.askForSeriesWithParam(sensor.name + '/data' + widget.additionnal, widget.withParam.toString(), beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                    else {
                        retrieveData.askForSeries(sensor.name + '/data' + widget.additionnal, beginDate, endDate, sensorDataRetrievingSuccess, errorOccurred, sensor, index);
                    }
                });
            }
        });

    }, errorOccurred);

};
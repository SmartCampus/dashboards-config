/**
 * Created by Garance on 30/11/2015.
 */

/** The dashboard parametres **/
if (typeof beginDate == 'undefined' || typeof endDate == 'undefined') {
    beginDate = '2015-06-21 8:00:11';
    endDate = '2015-09-21 18:00:11';
}


var temperaturesArray = [];
var drawLineChart = function () {
    $.post("http://localhost:8083/generateWidget", {
        job : "compareTemperature",
        config :
        {
            name: "c1",
            type : "line",
            yText: "Température ( °C)",
            seriesName : "temperaturesArray"
        }
    })
        .done(function (data) {
            console.log('request done !');
            console.log(data);
            eval(data);
            //  alert("Data Loaded: " + data);
        })
        .fail(function (data) {
            //  console.log(data);
            console.log('error in post gen');
            //    alert("error");
        })
        .always(function (data) {
        });

};


var firstSuccessInTemp = function (data) {
    temperaturesArray[0] = {"name": "inside temparature", "data": data.data};
    console.log('in 1st success for temp');
    //console.log(temperaturesArray[0]);
    if (typeof temperaturesArray[1] !== 'undefined') {
        drawLineChart();
    }
};

retrieveData.askForSeries('TEMP_443V/data', beginDate, endDate, firstSuccessInTemp);

var secondSuccessInTemp = function (data) {
    temperaturesArray[1] = {"name": "outside temparature", "data": data.data};
    console.log('in 2nd success for temp');
    if (typeof temperaturesArray[0] !== 'undefined') {
        drawLineChart();
    }
};
//We need to get the outside temperatures now, to build our whole graph.
retrieveData.askForSeries('TEMP_CAMPUS/data', beginDate, endDate, secondSuccessInTemp);

var drawBarChart = function () {
    $.post("http://localhost:8083/generateWidget", {
            job : "barGraph",
            config :
            {
                name: "c2",
                type : "column",
                "yAxis": [
                    {
                        "title" : "Number of times the window got opened",
                        "type" : "number"
                    },
                    {
                        "title" : "% of time AC is on",
                        "type" : "percent"
                    }
                ],
                "seriesName" : "countingArray"
            }
        }
    )
        .done(function (data) {
            console.log('request done !');
            console.log(data);
            eval(data);
            //  alert("Data Loaded: " + data);
        })
        .fail(function (data) {
            console.log(data);
            console.log('error in post gen');
            //    alert("error");
        })
        .always(function (data) {
        });




};


var countingArray = [];
var successForWindowCount = function (data) {
    countingArray[0] = {"name": "nb of window openings", "data": data.data};
    if (typeof countingArray[1] !== 'undefined') {
        drawBarChart();
    }
    console.log('in the window method');
};

successForAcCount = function (data) {
    countingArray[1] = {"name": "% of time the AC is on", "data": data.data};
    if (typeof countingArray[0] !== 'undefined') {
        drawBarChart();
    }
};
retrieveData.askForSeriesWithParam('AC_443STATE/data', 'true', beginDate, endDate, successForAcCount);

retrieveData.askForSeriesWithParam('WINDOW443STATE/data', 'true', beginDate, endDate, successForWindowCount);


var successForWindow = function (data) {
    $.post("http://localhost:8083/generateWidget",
        {
            job : "generateBoolean",
            config :
            {
                id: "windowState"
            }
        })
        .done(function (data) {
            console.log('request done !');
            console.log(data);
            eval(data);
        })
        .fail(function (data) {
            console.log('error in post gen');
        });
};
var successForAC = function (data) {
    $.post("http://localhost:8083/generateWidget",
        {
            job : "generateBoolean",
            config :
            {
                id: "climState"
            }
        })
        .done(function (data) {
            console.log('request done !');
            console.log(data);
            eval(data);
        })
        .fail(function (data) {
            console.log('error in post gen');
        });
};

retrieveData.askForStateNow('WINDOW443STATE', successForWindow);
retrieveData.askForStateNow('AC_443STATE', successForAC);
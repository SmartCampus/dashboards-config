/**
 * Created by Garance on 03/12/2015.
 */
var generate = (function () {
    return { //exposed to public
        widgetLine: function (successCB, errorCB) {
            $.post(genServer+widgetGen, {
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
                  //  console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    //  console.log(data);
                    console.log('error in post gen');
                    errorCB();
                });
        },
        widgetBar: function (successCB, errorCB) {
            $.post(genServer+widgetGen, {
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
                  //  console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in post gen');
                    errorCB();
                });
        },
        widgetBoolean: function(position, idWanted, name, successCB, errorCB) {
            $.post(genServer+widgetGen,
                {
                    job : "generateBoolean",
                    config :
                    {
                        id: idWanted,
                        position: position,
                        boolName:name
                    }
                })
                .done(function (data) {
                    console.log('request done !');
                   // console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log('error in post gen');
                    errorCB();
                });
        },
        widgetV2: function (graphType, yAxesArray, graphName, seriesName, successCB, errorCB) {

            $.post(genServer+widgetGen, {
                    job : widgetGen,
                    config :
                    {
                        graphType: graphType,
                        yAxes : yAxesArray,
                        graphName:graphName,
                        seriesArrayName : seriesName
                    }
                }
                )
                .done(function (data) {
                    console.log('request done !');
                    //  console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in post gen');
                    errorCB();
                });
        }
    }
}());
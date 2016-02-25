/**
 * Created by Garance on 03/12/2015.
 */
var generate = (function () {
    return { //exposed to public
        mapWidget: function(theTitle, nameOfTheDataArray, position, successCB, errorCB) {
            $.post(genServer+widgetGen,
                {
                    job : "generateMap",
                    config :
                    {
                        graphName:position,
                        graphTitle:theTitle,
                        seriesArrayName:nameOfTheDataArray
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
        widgetPie: function(graphName, graphTitle, arrayName, successCB, errorCB) {
            $.post(genServer+widgetGen,
                {
                    job : "generatePie",
                    config :
                    {
                        graphName:graphName,
                        graphTitle:graphTitle,
                        seriesArrayName:arrayName
                    }
                })
                .done(function (data) {
                    console.log('***********************************');
                     console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log('error in post gen');
                    errorCB();
                });
        },
        widget: function (graphTitle, graphType, yAxesArray, graphName, seriesName, successCB, errorCB) {
            $.post(genServer+widgetGen, {
                    job : 'generateGraph',
                    config :
                    {
                        graphType: graphType,
                        yAxes : yAxesArray,
                        graphName:graphName,
                        graphTitle:graphTitle,
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
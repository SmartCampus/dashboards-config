/**
 * Created by Garance on 03/12/2015.
 */
var generate = (function () {
    return { //exposed to public
        widgetBoolean: function(idWanted, successCB, errorCB) {
            $.post(genServer+widgetGen,
                {
                    job : "generateBoolean",
                    config :
                    {
                        id: idWanted
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
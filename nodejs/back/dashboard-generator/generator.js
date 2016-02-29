/**
 * @author Quentin Cornevin, Marc Karassev
 */

var Mustache = require("mustache"),
    fs = require('fs'),
    graphDefinitions = require("./graph_definitions"),
    layoutDefinitions = require("./layout_definitions");

function generateBoolean(config, res) {
    if(config.category === "STATE") {
        readTemplateFile("BooleanWidget.mustache", function (template) {
            var rendered = Mustache.render(template, config);
            res.send(rendered);
        });
    } else {
        readTemplateFile("lastValueWidget.mustache", function (template) {
            var rendered = Mustache.render(template, config);
            res.send(rendered);
        });
    }
}

/**
 * Generates code for a graph widget using the template/graph.mustache .
 * 
 * @param  {JSON}       config      configuration description as sent by the frontend,
 *                                  should match this template: (in case of scatter plot,
 *                                  there should not be any "yAxes" property)
 *          ,_---~~~~~----._            {
 *   _,,_,*^____      _____``*g*\"*,        "graphName": string,
 *  / __/ /'     ^.  / \      ^@q   f       "graphType": string,
 * [  @f | @))    |  | @))    l  0 _/       "yAxes": [
 *  \`/   \~____ / __ \_____/    \              {
 *   |           _l__l_           I                 "title": string,
 *   }          [______]           I                "type": string
 *   ]            | | |            |            },
 *   ]             ~ ~             |            ...
 *   |                            |         ],
 *    |                           |         "seriesArrayName": string,
 *                                          "graphTitle": string
 *                                      }
 * @param  {Function}   callback    function to call with the resulting generated code
 */
function generateGraph(config, callback) {
/*    console.log("------------------------ Config Before---------------------------------------------")
    console.log(config)
    console.log("---------------------------------------------------------------------")
*/
    readTemplateFile("graph.mustache", function (template) {
        //config = require(__dirname + "/template/graph.json");
        config = analyseGraphConfig(config);
 /*       console.log("-------------------------- Config After ------------------------------------")
        console.log(config);
        console.log("---------------------------------------------------------------------")
        */
        // console.log("" + Mustache.render(template, config));
        callback(Mustache.render(template, config));
    });
}

/**
 * Updates a graph widget generation configuration JSON received throught the web in order
 * to make it match the template/graph.json sample file.
 * 
 * @param  {JSON}       config      configuration description as sent by the frontend,
 *                                  should match this template: (in case of scatter plot,
 *                                  there should not be any "yAxes" property)
 *          ,_---~~~~~----._            {
 *   _,,_,*^____      _____``*g*\"*,        "graphName": string,
 *  / __/ /'     ^.  / \      ^@q   f       "graphType": string,
 * [  @f |    ((@ |  | @))    l  0 _/       "yAxes": [
 *  \`/   \~____ / __ \_____/    \              {
 *   |           _l__l_           I                 "title": string,
 *   }          [______]           I                "type": string
 *   ]            | | |            |            },
 *   ]             ~ ~             |            ...
 *   |                            |         ],
 *    |                           |         "seriesArrayName": string,
 *                                          "graphTitle": string
 *                                      }
 * @return {JSON}                   the updated configuration JSON as specified in the
 *                                  multipleYAxesGraph.json and scatterGraph.json files
 */
function analyseGraphConfig(config) {
    var yAxes = config.yAxes,
        graphType = graphDefinitions.getGraphType(config.graphType),
        yAxisType;

    var series = [];
    var counter = 0;

    for (var i = 0 ; i < yAxes.length ; i++) {
        var serie = {};
        yAxisType = graphDefinitions.getYAxisType(yAxes[i].unit);
        if (yAxisType) {
            console.log("--------------------- Before call --------------------------");
            console.log(yAxisType);
            console.log("--------------------- Before call --------------------------");

            graphDefinitions.copyYAxisTypeProperties(yAxisType, yAxes[i]);
            yAxes[i].index = i;
            yAxes[i].approxType = yAxisType.approxType;
            if (i < yAxes.length - 1) {
                yAxes[i].coma = ",";
            }

            if(yAxes[i].amount == 1 || typeof(yAxes[i].amount) == 'undefined') {
                console.log('yAxes amount is 1. ');
                serie.serieIndex = counter; //TODO: va pas parce que je prend l'index de l'axe : MAIS si j'avais un duo avant,
                //l'index c'est 1 mais dans mon tableau de données c'est 2 :(
                serie.yAxisIndex = i;
                serie.approxType = yAxisType.approxType;
                graphDefinitions.copyYAxisTypeProperties(yAxisType, serie);
                counter++;

                series.push(serie);
                if (i < yAxes.length - 1) {
                    serie.coma = ",";
                }
            } else {
                console.log('yAxes amount is not 1 : ', yAxes[i].amount);
                for(var j = 0; j < yAxes[i].amount; j++) {
                    var serie = {};
                    console.log('looping through one of my amount');
                    console.log(i, '+', j);
                    serie.serieIndex = parseInt(i) + parseInt(j);
                    serie.yAxisIndex = i;
                    serie.approxType = yAxisType.approxType;
                    graphDefinitions.copyYAxisTypeProperties(yAxisType, serie);

                    if (i < yAxes.length - 1 || j < yAxes[i].amount) {
                        serie.coma = ",";
                    }
                    series.push(serie);
                    counter++;

                }
            }
        }
        else {
            console.log("bad yAxesType");
        }
        config.series = series

    }

    if (graphType) {
        config.grpPixelNb = graphType.grpPixelNb;
        if (graphType === graphDefinitions.getGraphType("scatter")) {
            config.scatter = true;
        }
    }
    else {
        config.grpPixelNb = 50;
        // TODO default graphType
    }
    if (yAxes && yAxes.length > 1) {
        config.defineMultipleAxes = true;
    }


    return config;
}

/**
 * Generates code for a pie chart widget using the template/pie.mustache .
 * 
 * @param  {JSON}       config    {
 *                                    "graphName": string,
 *                                    "graphTitle": string,
 *                                    "seriesArrayName": string
 *                                }
 * @param  {Function}   callback    function to call with the resulting generated code
 */
function generatePie(config, callback) {
    console.log(config);
    readTemplateFile("pie.mustache", function (template) {
        //config = require(__dirname + "/template/pie.json");
        callback(Mustache.render(template, config));
    });
}

function generateLayout(config, callback) {
    readTemplateFile("layout.mustache", function (template) {
        //config = require(__dirname + "/template/layout.json");
        //config.widgetWidth = layoutDefinitions.getLayoutWidgetWidth(config.layoutType);
        if(config.layoutType) {
            callback(null, Mustache.render(template, layoutDefinitions.getLayoutWidgetWidth(config)));
        } else {
            callback("error", null);
        }
    });
}

function readTemplateFile(templateFile, callback) {
    fs.readFile(__dirname + "/template/" + templateFile, "utf-8", function (err, template) {
        if (err) {
            throw err;
        }
        callback(template);
    });
}

function generateMap(config, callback) {
    console.log(config);
    readTemplateFile("map.mustache", function (template) {
        callback(null, Mustache.render(template, config));
    });
}

// Exports

exports.generateBoolean = generateBoolean;

exports.generateGraph = generateGraph;

exports.generatePie = generatePie;

exports.generateLayout = generateLayout;

exports.generateMap = generateMap;
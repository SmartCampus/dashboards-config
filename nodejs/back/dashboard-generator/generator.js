/**
 * @author Quentin Cornevin, Marc Karassev
 */

var Mustache = require("mustache"),
    fs = require('fs'),
    graphDefinitions = require("./graph_definitions");

function generateBoolean(config, res) {
    var value = config;
    var template = "";

    fs.readFile(__dirname + '/template/BooleanWidget.mustache', "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        res.send(rendered);
    });
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
    console.log(config);
    fs.readFile(__dirname + "/template/graph.mustache", "utf-8", function (err, template) {
        if (err) {
            throw err;
        }
        //config = require(__dirname + "/template/graph.json");
        config = analyseGraphConfig(config);
        console.log(config);
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

    for (var i in yAxes) {
        yAxisType = graphDefinitions.getYAxisType(yAxes[i].type);
        if (yAxisType) {
            graphDefinitions.copyYAxisTypeProperties(yAxisType, yAxes[i]);
            yAxes[i].index = i;
            yAxes[i].approxType = yAxisType.approxType;
            if (i < yAxes.length - 1) {
                yAxes[i].coma = ",";
            }
        }
        else {
            console.log("bad yAxesType");
        }
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
    fs.readFile(__dirname + "/template/pie.mustache", "utf-8", function (err, template) {
        if (err) {
            throw err;
        }
        //config = require(__dirname + "/template/pie.json");
        callback(Mustache.render(template, config));
    });
}

// Exports

exports.generateBoolean = generateBoolean;

exports.generateGraph = generateGraph;

exports.generatePie = generatePie;
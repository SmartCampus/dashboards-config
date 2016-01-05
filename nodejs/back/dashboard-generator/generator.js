/**
 * @author Quentin Cornevin, Marc Karassev
 */

var Mustache = require("mustache"),
    handlebar = require("handlebars"),
    fs = require('fs'),
    graphDefinitions = require("./graph_definitions");

function loadTemperatureGraph(config ,res) {
    var template = "";
    var value =
    {
        "name": config.name,
        "type": config.type,
        "yAxis": config.yText,
        "seriesName" : config.seriesName
    };

    fs.readFile(__dirname + '/template/TemperatureGraph.mustache', "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        res.send(rendered);
    });
};

function loadBarGraph(config, res) {
    var value = config;
    for(var i in value.yAxis) {
        if(value.yAxis[i].type == "number") {
            value.yAxis[i].min = 0;
            value.yAxis[i].max = "undefined";
            value.yAxis[i].format = "";
        } else if(value.yAxis[i].type == "percent") {
            value.yAxis[i].min = 0;
            value.yAxis[i].max = 100;
            value.yAxis[i].format = "%";
        }
        if(i == (value.yAxis.length - 1)) {
            value.yAxis[i].coma = "";
        } else {
            value.yAxis[i].coma = ",";
        }

        value.yAxis[i].index = i;
    }

    var template = "";

    fs.readFile(__dirname + '/template/BarGraph.mustache', "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        res.send(rendered);
    });
}

function loadBooleanGraph(config, res) {
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
 * Generates code for a widget using the template/Widget.mustache .
 * 
 * @param  {JSON}       config      configuration description as sent by the frontend,
 *                                  should match this template:
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
 *    |                           |         "seriesArrayName": string
 *                                      }
 * @param  {Function}   callback    function to call with the resulting generated code
 */
function generateWidget(config, callback) {
    console.log(config);
    fs.readFile(__dirname + "/template/Widget.mustache", "utf-8", function (err, template) {
        if (err) {
            throw err;
        }
        //config = require(__dirname + "/template/Widget.json");
        config = analyseConfig(config);
        console.log(config);
        // console.log("" + Mustache.render(template, config));
        callback(Mustache.render(template, config));
    });
}

/**
 * Updates a widget generation configuration JSON received throught the web in order
 * to make it match the template/Widget.json sample file.
 * 
 * @param  {JSON}       config      configuration description as sent by the frontend,
 *                                  should match this template:
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
 *    |                           |         "seriesArrayName": string
 *                                      }
 * @return {JSON}                   the updated configuration JSON as specified in the
 *                                  template/Widget.json file
 */
function analyseConfig(config) {
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
    config.grpPixelNb = graphType.grpPixelNb;
    if (yAxes.length > 1) {
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
// TODO remove unused

exports.loadBooleanGraph = loadBooleanGraph;

exports.loadBarGraph = loadBarGraph;

exports.loadTemperatureGraph = loadTemperatureGraph;

exports.generateWidget = generateWidget;

exports.generatePie = generatePie;
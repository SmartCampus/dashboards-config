/**
 * Created by Quentin on 12/3/2015.
 */
var Mustache = require("mustache"),
    handlebar = require("handlebars"),
    fs = require('fs');


function loadTemperatureGraph(config ,res) {
    var template = "";
    var value =
    {
        "name": config.name,
        "type": config.type,
        "yAxis": config.yText,
        "seriesName" : config.seriesName
    };

    fs.readFile('./template/TemperatureGraph.mustache', "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        res.send(rendered);
    });
};

function loadBarGraph(config, res) {


    /**
     * Input :
     * {
     *      name : "c1",
     *      graphType : "column"
     *      "yAxis" : [
     *          {
     *              "title": “Nb of times the window got opened”
     *              “type”: “number”
     *          },
     *          {
     *           ...
     *           }
     *      ]
     *      "seriesName" : "Name of serie"
     * }
     *
     *
     *
     */

    var value = config;
    for(var i in value.yAxis) {
        if(value.yAxis[i].type == "number") {
            value.yAxis[i].min = 0;
            value.yAxis[i].max = undefined;
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

    console.log(value);
    var template = "";

    fs.readFile('./template/BarGraph.mustache', "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        res.send(rendered);
    });
}


exports.loadBarGraph = loadBarGraph;

exports.loadTemperatureGraph = loadTemperatureGraph;
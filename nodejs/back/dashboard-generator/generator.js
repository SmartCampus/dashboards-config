/**
 * Created by Quentin on 12/3/2015.
 */
var Mustache = require("mustache"),
    value = require("./template/TemperatureGraph.json"),
    fs = require('fs')
;


function loadTemperatureGraph(res) {

    var template = "";


    fs.readFile('./template/TemperatureGraph.mustache', "utf-8", function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        res.send(rendered);
    });
};


exports.loadTemperatureGraph = loadTemperatureGraph;
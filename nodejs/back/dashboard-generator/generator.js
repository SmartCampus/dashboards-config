/**
 * Created by Quentin on 12/3/2015.
 */
var Mustache = require("mustache"),
//    value = require("./template/TemperatureGraph.json"),
    fs = require('fs')
;


function loadTemperatureGraph(config ,res) {

    /* {
     "graphName": "'#c1'",
     "graphType" : "'line'",
     "yAxis": "'Temperature ( °C)'",
     "dataName" : "temperaturesArray"
     }
*/

    var template = "";
    console.log("Config : " + config);
    var value =
    {
        "graphName": config.id,
        "graphType": config.type,
        "yAxis": config.yText,
        "dataName" : config.seriesName
    };
    console.log("Value : " +  value.graphName);

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
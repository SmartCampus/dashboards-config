/**
 * Created by Quentin on 12/2/2015.
 */
var Mustache = require("mustache");
var $ = require("jquery");
var value = require("./dataView.json");
var fs = require('fs');


(function loadUser() {

    var template = "";


    fs.readFile('./TemperatureGraph.mustache',"utf-8" , function (err, data) {
        if (err) {
            throw err;
        }
        template = data;
        var rendered = Mustache.render(template, value);
        console.log(rendered);
    });
})();


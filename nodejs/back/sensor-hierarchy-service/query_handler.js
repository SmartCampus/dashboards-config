/**
 * @author Quentin Cornevin.
 */
var sensors = require('./Sensors.js');

function handleQuery(queries, res) {
    var sensorsArray = [];

    for(var query in queries) {
        console.log(sensors.getSmartCampusSensors().length);
        var smartCampusSensors = sensors.getSmartCampusSensors();
        for(var iterator in smartCampusSensors) {
            var name = smartCampusSensors[iterator].getName();
            if(queries[query] === name.replace(/\s+/g, '')) {
                for(var sensor in smartCampusSensors[iterator].getSensors()) {
                    sensorsArray.push(sensors.getSmartCampusSensors()[iterator].getSensors()[sensor]);
                }
            }
        }
    }
/*
    var result = sensorsArray.shift().filter(function(v) {
        return sensorsArray.every(function(a) {
            return a.indexOf(v) !== -1;
        });
    }); */


 /*   var queryInArray = [];
    for(var i in queries) {
        queryInArray.push(queries[i]);
    }

    var arrays = [queryInArray, Sensors.getSmartCampusSensors()];
    console.log(Sensors.getSmartCampusSensors());
    console.log(queryInArray);
    var result = arrays.shift().filter(function(v) {
        return arrays.every(function(a) {
            return a.indexOf(v) !== -1;
        });
    });

    for(var iter in Sensors.getSmartCampusSensors()) {
        if(Sensors.getSmartCampusSensors()[iter] == result[0]) {

        }
    } */

    res.send(sensorsArray);
}

exports.handleQuery = handleQuery;



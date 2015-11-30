/**
 * @author Quentin Cornevin.
 */
var sensors = require('./Sensors.js');

function handleQuery(queries, res) {
    var sensorsArray = [];

    for(var query in queries) {
        var queryResult = [];
        console.log(sensors.getSmartCampusSensors().length);
        var smartCampusSensors = sensors.getSmartCampusSensors();
        for(var iterator in smartCampusSensors) {
            var name = smartCampusSensors[iterator].getName();
            if(queries[query] === name.replace(/\s+/g, '')) {
                for(var sensor in smartCampusSensors[iterator].getSensors()) {
                    queryResult.push(sensors.getSmartCampusSensors()[iterator].getSensors()[sensor]);
                }
            }
        }
        sensorsArray.push(queryResult);
    }

    var result = sensorsArray.shift().filter(function(v) {
        return sensorsArray.every(function(a) {
            return a.indexOf(v) !== -1;
        });
    });
    res.send(result);
}

exports.handleQuery = handleQuery;



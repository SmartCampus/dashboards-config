/**
 * Created by Quentin on 12/1/2015.
 */
var requester = require("./api_requester");


function requestSensors(queries, response) {
    var stringQuery = "?";
    for(var i in queries) {
        stringQuery += i + "=" + queries[i] + "&";
    }

    requester.getSensors(stringQuery, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
           stringData += chunck;
        });

        res.on("end", function() {
            var tempPerTime = JSON.parse(stringData);
            response.send(tempPerTime);
        })
    });
}


function getSensorInformation(sensorId, date, state, response) {
    requester.getSensorData(sensorId, date, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            var responseInGoodFormat = {"data": []};

            for(var i in tempPerTime.values) {
                var temperaturePerTime = [];
                temperaturePerTime.push((tempPerTime.values[i].date)*1000);
                if(state) {
                    if(tempPerTime.values[i].value == "ON") {
                        temperaturePerTime.push(1);
                    } else {
                        temperaturePerTime.push(0);
                    }
                } else {
                    temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
                }
                responseInGoodFormat.data.push(temperaturePerTime);
            }

            response.send(responseInGoodFormat);
        });
    });
}


exports.getSensorInformation = getSensorInformation;


exports.requestSensors = requestSensors;
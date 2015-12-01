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


exports.requestSensors = requestSensors;
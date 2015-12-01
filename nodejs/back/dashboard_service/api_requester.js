/**
 * Created by Quentin on 12/1/2015.
 */

var http = require("http"),
    API_HOST = "http://localhost:8081",
    SENSORS_PATH = "/sensors";



function getSensors(queries, callback) {
    var url = API_HOST + SENSORS_PATH + queries;
    console.log(queries);
    http.get(url, function(res) {
        callback(res);
    })
    .on('error', function(e) {
           error(e, "getSensors");
        });
}


exports.getSensors = getSensors;
/**
 * Created by Quentin on 12/1/2015.
 */

var http = require("http"),
    API_HOST = "http://localhost:8081",
    SENSORS_PATH = "/sensors",
    SENSOR_PATH = "/sensor";



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

/**
 * Retrieves sensor data.
 *
 * @param  {[string]}   name     	the sensor's name
 * @param  {[string]}   date   		Date of the wished data or date range:
 *                               	YYYY-MM-DD hh:mm:ss[/YYYY-MM-DD hh:mm:ss]
 *                               	if no date is given, all sensor data will be returned
 * @param  {[boolean]}   convert 	whether the timestamps should be converted
 *                               	into "human readable" dates
 * @param  {Function} callback 		function to call when job is finished with
 *                             		the body response from the API call
 */
function getSensorData(name, date, callback) {
    var url = API_HOST + SENSOR_PATH + "/" + name + "/data" +  (date? "?date=" + date : "");
    console.log(url);
    http.get(url, function (res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getSensorData");
        });
}


exports.getSensorData = getSensorData;



exports.getSensors = getSensors;
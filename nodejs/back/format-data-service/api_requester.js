/**
 * @author Marc Karassev, Quentin Cornevin
 */

var http = require("http"),
    API_HOST = "http://localhost:8081",
    SENSORS_PATH = "/sensors",
    CONTAINER_PATH = "/container",
    SENSOR_PATH = "/sensor";

function error(e, msg) {
    console.log(msg + ":", e.message);
}

function getSensors(queries, callback) {
    var url = API_HOST + SENSORS_PATH + queries;
    console.log(url);
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


/**
 * Retrieves the last data from a specific sensor.
 *
 * @param  {[string]}	name 		the sensor's name
 * @param  {[boolean]}  convert 	whether the timestamps should be converted
 *                               	into "human readable" dates
 * @param  {Function}	callback	function to call when job is finished with
 *                             		the body response from the API call
 */
function getLastSensorData(name, callback) {
    var url = API_HOST + SENSOR_PATH + "/" + name + "/data" + "/last";
    console.log(url);
    http.get(url, function (res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getSensorData");
        });
}

/**
 * TODO
 * @param name
 * @param callback
 */
function getContainerChild(name, callback) {
    var url = API_HOST + CONTAINER_PATH + "/" + name + "/child";
    console.log(url);
    http.get(url, function (res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getSensorData");
        });
}

/**
 * This function will ask the sensor container api to have the enhanced information about the sensor with the given name
 *
 * @param   sensorName      {string}    Name of the sensor
 * @param   callback        {function}  Function called with the given response or error
 */
function getEnhancedSensorsData(sensorName, callback) {
    var url = API_HOST + SENSOR_PATH + "/" + sensorName + "/fullInformation"
    console.log(url);
    http.get(url, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end", function() {
            try {
                var json = JSON.parse(stringData);
                callback(json, null);
            } catch(e) {
                callback(null, e);
            }
        });

    })
        .on('error', function(e) {
            callback(null, e);
            error(e, "getSensorsFullInformation")
        });
}

exports.getEnhancedSensorsData = getEnhancedSensorsData;

exports.getContainerChild = getContainerChild;

exports.getSensorData = getSensorData;

exports.getLastSensorData = getLastSensorData;

exports.getSensors = getSensors;
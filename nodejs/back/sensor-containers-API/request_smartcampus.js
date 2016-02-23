/**
 * @author Quentin Cornevin & Marc Karassev
 *
 * Module responsible for querying SmartCampus' data API.
 */

var http = require("http"),
    SMARTCAMPUS_HOST = "http://smartcampus.unice.fr",
    SENSORS_PATH = "/sensors";

function error(e, msg) {
	console.log(msg + ":", e.message);
}

/**
 * Retrieves all sensors from SmartCampus.
 *
 * @param   {Function}          callback function to call when job is finished with
 *                              the body response from the API call
 */
function getAllSensors(callback) {
    var url = SMARTCAMPUS_HOST + SENSORS_PATH;

    http.get(url, function(res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getAllSensors");
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
function getSensorData(name, date, convert, callback) {
    var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/" + name + "/data?convert=" + convert + (date? "&date=" + date : "");
    http.get(url, function (res) {
        console.log("----------------------------------------------------------------------------")
        console.log(res);
        console.log("----------------------------------------------------------------------------")
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
function getLastSensorData(name, convert, callback) {
    var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/" + name + "/data" + "/last" + "?convert=" + convert;

    http.get(url, function (res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getSensorData");
        });
}


exports.getLastSensorData = getLastSensorData;

exports.getSensorData = getSensorData;


/**
 * Retrieves all sensors from SmartCampus.
 *
 * @type {getAllSensors}
 */
exports.getAllSensors = getAllSensors;

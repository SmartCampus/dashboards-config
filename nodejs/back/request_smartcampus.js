/**
 * @author Marc Karassev
 *
 * Module responsible for querying SmartCampus' data API.
 */

var http = require("http"),
	SMARTCAMPUS_HOST = "http://smartcampus.unice.fr",
	SENSORS_PATH = "/sensors";

function error(e, where) {
 	console.log("Got error in", where, ": " + e.message);
}

/**
 * Retrieves all sensors from SmartCampus.
 * 
 * @param  {Function} callback function to call when job is finished with
 *                             the body response from the API call
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
		callback(res);
	})
	.on('error', function (e) {
		error(e, "getSensorData");
	});
}

// Test

function test() {
	function logRes(req, res) {
		res.on('data', function (chunk) {
		console.log("********** received chunk from", req, "**********\n" + chunk);
		});
		res.on('end', function () {
		console.log("********** end of", req, "**********");
		});
	}

	getAllSensors(function (res) {
		logRes("getAllSensors", res);
	});
	getLastSensorData("DOOR_443", false, function (res) {
		logRes("getLastSensorData for DOOR_443", res);
	});
	getSensorData("DOOR_443", "2015-10-14 18:00:11", false, function (res) {
		logRes("getSensorData for DOOR_443 at 2015-10-14 18:00:11", res);
	});
	getSensorData("DOOR_443", "2015-09-01 00:00:00/2015-10-01 00:00:00",
		true, function (res) {
			logRes("getSensorData for DOOR_443 between 2015-09-01 00:00:00 and 2015-10-01 00:00:00", res);
	});
}

// Exports

exports.getAllSensors = getAllSensors;
exports.getLastSensorData = getLastSensorData;
exports.getSensorData = getSensorData;
exports.test = test;
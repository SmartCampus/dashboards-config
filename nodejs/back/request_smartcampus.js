var http = require("http"),
	SMARTCAMPUS_HOST = "http://smartcampus.unice.fr",
	SENSORS_PATH = "/sensors";

function error(e, where) {
 	console.log("Got error in", where, ": " + e.message);
}

function getAllSensors(callback) {
	var url = SMARTCAMPUS_HOST + SENSORS_PATH;

	http.get(url, function(res) {
		callback(res);
	})
	.on('error', function (e) {
		error(e, "getAllSensors");
	});
}

function getLastSensorData(name, convert, callback) {
	var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/" + name + "/data" + "/last" + "?convert=" + convert;

	http.get(url, function (res) {
		callback(res);
	})
	.on('error', function (e) {
		error(e, "getSensorData");
	});
}

function getSensorData(name, date, convert, callback) {
	var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/" + name + "/data?convert=" + convert + (date? "&date=" + date : "");

	http.get(url, function (res) {
		callback(res);
	})
	.on('error', function (e) {
		error(e, "getSensorData");
	});
}

// Exports

exports.getAllSensors = getAllSensors;
exports.getLastSensorData = getLastSensorData;
exports.getSensorData = getSensorData;

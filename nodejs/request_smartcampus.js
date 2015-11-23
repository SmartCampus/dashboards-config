var http = require("http"),
	SMARTCAMPUS_HOST = "http://smartcampus.unice.fr",
	SENSORS_PATH = "/sensors";

function error(e, where) {
 	console.log("Got error in", where, ": " + e.message);
}

function getAllSensors(callback) {
	var url = SMARTCAMPUS_HOST + SENSORS_PATH;

	http.get(url, function(res) {
		callback(url, res);
	})
	.on('error', function (e) {
		error(e, "getAllSensors");
	});
}

function getSensorData(name, last, callback) {
	var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/" + name + "/data" + (last? "/last" : "");

	http.get(url, function (res) {
		callback(url, res);
	})
	.on('error', function (e) {
		error(e, "getSensorData");
	});
}

exports.getAllSensors = getAllSensors;
exports.getSensorData = getSensorData;
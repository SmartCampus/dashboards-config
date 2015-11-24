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
var requestSmartcampus = require("./request_smartcampus"),
	sensors = [],
	windowSensors = [];

function initSensors(callback) {
	requestSmartcampus.getAllSensors(function (res) {
		var stringData = "";

		res.on("data", function (chunk) {
			stringData += chunk;
		});
		res.on("end", function () {
			sensors = (JSON.parse(stringData))._items;
			initWindowSensors(callback);
		})
	})
}

function initWindowSensors(callback) {
	var windowRegExp = /window/i;

	for (var i in sensors) {
		if (windowRegExp.test(sensors[i].name)) {
			windowSensors.push(sensors[i]);
		}
	}
	callback();
}

function getSensors() {
	return sensors;
}

function getWindowSensors() {
	return windowSensors;
}

// Exports

exports.initSensors = initSensors;
exports.getSensors = getSensors;
exports.getWindowSensors = getWindowSensors;
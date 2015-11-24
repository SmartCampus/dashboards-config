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

function getSensorsMatchingFilters() {
	var filters = arguments, filter, matchingSensors = [];

	for (var i in sensors) {
		for (var j in filters) {
			filter = new RegExp(filters[j], "i");
			if (!filter.test(sensors[i].name)) {
				break;
			}
			if (j == filters.length - 1) {
				matchingSensors.push(sensors[i]);
			}
		}
	}
	return matchingSensors;
}

// Test

function test() {
	console.log("********** Sensors: **********");
	console.log(smartCampusModel.getSensors());
	console.log("********** Window sensors: **********");
	console.log(smartCampusModel.getWindowSensors());
	console.log("********** Sensors in desk 443 **********");
	console.log(smartCampusModel.getSensorsMatchingFilters("443"));
	console.log("********** Temp sensors in desk 443 **********");
	console.log(smartCampusModel.getSensorsMatchingFilters("443", "temp"));
}

// Exports

exports.initSensors = initSensors;
exports.getSensors = getSensors;
exports.getWindowSensors = getWindowSensors;
exports.getSensorsMatchingFilters = getSensorsMatchingFilters;
exports.test = test;
/**
 * @author Marc Karassev
 *
 * Model representing SmartCampus. Is should be used as a shortcut when retrieving
 * SmartCampus sensors information.
 */

var requestSmartcampus = require("./request_smartcampus"),
	sensors = [],
	windowSensors = [];

/**
 * Retrieves the sensors from SmartCampus API and initializes the model.
 * 
 * @param  {Function} callback	function to call when the initialization has finished
 */
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

/**
 * Gets the sensors array. Requires that initSensors was called and terminated.
 * 
 * @return {[string]} an array of string representing JSON sensors
 */
function getSensors() {
	return sensors;
}

/**
 * Gets the windows sensors array. Requires that initSensors was called and terminated.
 * 
 * @return {[string]} an array of string representing JSON sensors
 */
function getWindowSensors() {
	return windowSensors;
}

/**
 * Gets a sensors array matching the given filters.
 * Requires that initSensors was called and terminated.
 * Should not be used due to its high complexity unless there's not another relevant getter.
 *
 * @param {string...}	filters 	strings to be used as regular expressions
 * @return {[string]} an array of string representing JSON sensors
 */
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
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
			console.log("********** Sensors: **********");
			console.log(sensors);
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
	console.log("********** Window sensors: **********");
	console.log(windowSensors);
	callback();
}

// Exports

exports.initSensors = initSensors;
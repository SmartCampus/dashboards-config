var requestSmartcampus = require("./request_smartcampus"),
	sensors = [],
	windowSensors = [];

function initSensors() {
	requestSmartcampus.getAllSensors(function (res) {
		var stringData = "";

		res.on("data", function (chunk) {
			stringData += chunk;
		});
		res.on("end", function () {
			sensors = (JSON.parse(stringData))._items;
			console.log(sensors);
		})
	})
}

// Exports

exports.initSensors = initSensors;
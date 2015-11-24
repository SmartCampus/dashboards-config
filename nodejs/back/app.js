var smartCampusModel = require("./smartcampus_model");
// var requestSmartcampus = require("./request_smartcampus");

smartCampusModel.initSensors(function () {
	console.log("********** Sensors: **********");
	console.log(smartCampusModel.getSensors());
	console.log("********** Window sensors: **********");
	console.log(smartCampusModel.getWindowSensors());
	console.log("********** Sensors in desk 443 **********");
	console.log(smartCampusModel.getSensorsMatchingFilters("443"));
	console.log("********** Temp sensors in desk 443 **********");
	console.log(smartCampusModel.getSensorsMatchingFilters("443", "temp"));
});

// requestSmartcampus.test();
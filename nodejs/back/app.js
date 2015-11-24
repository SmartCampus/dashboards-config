var smartCampusModel = require("./smartcampus_model");
// var requestSmartcampus = require("./request_smartcampus");

smartCampusModel.initSensors(function () {
	console.log("********** Sensors: **********");
	console.log(smartCampusModel.getSensors());
	console.log("********** Window sensors: **********");
	console.log(smartCampusModel.getWindowSensors());
});
// requestSmartcampus.test();
var smartCampusModel = require("./smartcampus_model");
// var requestSmartcampus = require("./request_smartcampus");

smartCampusModel.initSensors(function () {
	smartCampusModel.test();
});

// requestSmartcampus.test();
var requestSmartCampus = require("../request_smartcampus"),
	assert = require("assert"),
	logger = require("../logger");

describe("#getSensorsByCategory()", function () {

	it("should produce an error when SmartCampus is unreachable", function (done) {
		requestSmartCampus.getSensorsByCategory("Comparison", function (err, results) {
			if (err) {
				assert(err.whileReachingSmartCampus);
				assert(!results);
			}
			done();
		});
	});
});
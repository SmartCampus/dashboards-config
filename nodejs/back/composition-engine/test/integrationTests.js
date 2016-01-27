/**
 * @author Marc Karassev
 */

var request = require("supertest"),
	async = require("async"),
	assert = require("assert"),
	app = require("../app"),
	logger = require("../logger");

var NEEDS = require("../needs").NEEDS,
	SENSOR_CATEGORIES = require("../needs").SENSOR_CATEGORIES;

describe("composition engine", function () {

	describe("POST sensorSet", function () {

		var sensorSetPath = "/sensorSet";

		// function testPostSensorSet(sensors, expectedNeeds, callback) {
		// 	request(app)
		// 		.post(sensorSetPath)
		// 		.send(sensors)
		// 		.expect(200)
		// 		.expect(function (response) {
		// 			var results = response.body;

		// 			assert(Array.isArray(results));
		// 			assert(results.find(function (result) {
		// 				return result.name === NEEDS.COMPARISON.name;
		// 			}));
		// 			assert(results.find(function (result) {
		// 				return result.name === NEEDS.OVERTIME.name;
		// 			}));
		// 		})
		// 		.end(callback);
		// }

		describe("summer dashboard", function () {

			var temp443V = { name: "TEMP_443V", category: SENSOR_CATEGORIES.TEMP },
				tempCampus = { name: "TEMP_CAMPUS", category: SENSOR_CATEGORIES.TEMP },
				ac443State = { name: "AC_443STATE", category: SENSOR_CATEGORIES.NUMBER },
				window443State = { name: "WINDOW443STATE", category: SENSOR_CATEGORIES.NUMBER };

			it("should get Comparison and Overtime needs", function (done) {
				var requestsBodies = [temp443V, tempCampus];
				
				async.each(requestsBodies, function iterator (item, callback) {
					request(app)
						.post(sensorSetPath)
						.send([item])
						.expect(200)
						.expect(function (response) {
							var results = response.body;

							assert(Array.isArray(results));
							assert(results.find(function (result) {
								return result.name === NEEDS.COMPARISON.name;
							}));
							assert(results.find(function (result) {
								return result.name === NEEDS.OVERTIME.name;
							}));
						})
						.end(callback);
				}, function join (err) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
			});

			// it("should return ONLY Comparison and Overtime needs", function (done) {
			// 	testGetNeedsMatchingSensors([temp443V, tempCampus],
			// 		[NEEDS.COMPARISON, NEEDS.OVERTIME], true, done);
			// });

			it("should return Comparison, Overtime and Proportion needs", function (done) {
				var requestsBodies = [ac443State, window443State];
				
				async.each(requestsBodies, function iterator (item, callback) {
					request(app)
						.post(sensorSetPath)
						.send([item])
						.expect(200)
						.expect(function (response) {
							var results = response.body;

							assert(Array.isArray(results));
							assert(results.find(function (result) {
								return result.name === NEEDS.COMPARISON.name;
							}));
							assert(results.find(function (result) {
								return result.name === NEEDS.OVERTIME.name;
							}));
							assert(results.find(function (result) {
								return result.name === NEEDS.PROPORTION.name;
							}));
						})
						.end(callback);
				}, function join (err) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
			});

			// it("should return ONLY Comparison, Overtime and Proportion needs", function (done) {
			// 	testGetNeedsMatchingSensors([ac443State, window443State],
			// 		[NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION], true, done);
			// });

			it("should return See Status need", function (done) {
				var requestsBodies = [ac443State, window443State];
				
				async.each(requestsBodies, function iterator (item, callback) {
					request(app)
						.post(sensorSetPath)
						.send([item])
						.expect(200)
						.expect(function (response) {
							var results = response.body;

							assert(Array.isArray(results));
							assert(results.find(function (result) {
								return result.name === NEEDS.SEE_STATUS.name;
							}));
						})
						.end(callback);
				}, function join (err) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
			});
		});
	});
});

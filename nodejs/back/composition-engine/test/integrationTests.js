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

	describe("POST needSet", function () {

		var needSetPath = "/needSet",
			unconsistentNeeds = { needs: [NEEDS.COMPARISON.name, NEEDS.RELATIONSHIPS.name,
					NEEDS.SUMMARIZE.name] };

		function testPostNeedSet(needs, expectedSensors, callback) {
			request(app)
				.post(needSetPath)
				.send(needs)
				.expect(200)
				.expect(function (response) {
					var results = response.body;

					assert(Array.isArray(results));
					expectedSensors.forEach(function (expected) {
						assert(results.find(function (result) {
							return result.name === expected.name;
						}));
					});
				})
				.end(callback);
		}

		it ("should respond with a 400 flag with an inconsistent need set", function (done) {
			request(app)
				.post(needSetPath)
				.send(unconsistentNeeds)
				.expect(400)
				// TODO error message
				.end(done);
		});

		describe("summer dashboard", function () {

			var summerWidget1Needs = { needs: [NEEDS.COMPARISON.name, NEEDS.OVERTIME.name] },
				summerWidget2Needs = { needs: [NEEDS.COMPARISON.name, NEEDS.OVERTIME.name,
					NEEDS.PROPORTION.name] },
				summerWidget34Needs = { needs: [NEEDS.SEE_STATUS.name] };

			it("should return all sensor categories", function (done) {
				async.each([summerWidget1Needs, summerWidget2Needs], function iterator (item, callback) {
					request(app)
						.post(needSetPath)
						.send(item)
						.expect(200)
						.expect(function (response) {
							var results = response.body;

							logger.debug(results);
							assert.equal(Object.keys(SENSOR_CATEGORIES).length, results.length);
							for (var category in SENSOR_CATEGORIES) {
								assert(results.find(function predicate(element, index, array) {
									return element.set === category;
								}));
							}
							for (var i = results.length - 1; i >= 0; i--) {
								assert(Array.isArray(results[i].sensors));
							};
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

			it("should return NUMBER category", function (done) {
				request(app)
					.post(needSetPath)
					.send(summerWidget34Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body;

						assert.equal(1, results.length);
						assert.equal(SENSOR_CATEGORIES.NUMBER, results[0].set);
						assert(Array.isArray(results[0].sensors));
						logger.debug(results[0].sensors);
					})
					.end(done);
			});
		});
	});

	describe("POST sensorSet", function () {

		var sensorSetPath = "/sensorSet";

		function testPostSensorSet(sensors, expectedNeeds, callback) {
			request(app)
				.post(sensorSetPath)
				.send(sensors)
				.expect(200)
				.expect(function (response) {
					var results = response.body;

					assert(Array.isArray(results));
					expectedNeeds.forEach(function (expected) {
						assert(results.find(function (result) {
							return result.name === expected.name;
						}));
					});
				})
				.end(callback);
		}

		describe("summer dashboard", function () {

			var temp443V = { name: "TEMP_443V", category: SENSOR_CATEGORIES.TEMP },
				tempCampus = { name: "TEMP_CAMPUS", category: SENSOR_CATEGORIES.TEMP },
				ac443State = { name: "AC_443STATE", category: SENSOR_CATEGORIES.NUMBER },
				window443State = { name: "WINDOW443STATE", category: SENSOR_CATEGORIES.NUMBER };

			it("should get Comparison and Overtime needs", function (done) {
				var requestsBodies = [temp443V, tempCampus];
				
				async.each(requestsBodies, function iterator (item, callback) {
					testPostSensorSet({ sensors: [item] }, [NEEDS.OVERTIME, NEEDS.COMPARISON], function () {
						callback(null);
					});
				}, function join (err) {
					if (err) {
						logger.error(err);
						assert(!err);
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
					testPostSensorSet({ sensors: [item] },
						[NEEDS.OVERTIME, NEEDS.COMPARISON, NEEDS.PROPORTION], function () {
						callback(null);
					});
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
					testPostSensorSet({ sensors: [item] }, [NEEDS.SEE_STATUS], function () {
						callback(null);
					});
				}, function join (err) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
			});

			// TODO error cases
		});
	});
});

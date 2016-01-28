/**
 * @author Marc Karassev
 */

var assert = require("assert"),
	async = require("async"),
	needs = require("../needs"),
	logger = require("../logger");

var NEEDS = needs.NEEDS,
	SENSOR_CATEGORIES = needs.SENSOR_CATEGORIES;

var summerWidget1Needs = [NEEDS.COMPARISON, NEEDS.OVERTIME],
	summerWidget2Needs = [NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION],
	summerWidget34Needs = [NEEDS.SEE_STATUS],
	unconsistentNeeds = [NEEDS.COMPARISON, NEEDS.RELATIONSHIPS, NEEDS.SUMMARIZE];

describe("needs", function () {

	describe("#checkNeedsConsistency()", function () {

		describe("summer dashboard", function () {

			it("should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(summerWidget1Needs));
			});

			it("should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(summerWidget2Needs));
			});

			it("should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(summerWidget34Needs));
			});
		});

		it("should not be a consistent need set", function () {
			assert(!needs.checkNeedsConsistency(unconsistentNeeds));
		});
	});

	describe("#getNeedsByName()", function () {

		describe("summer dashboard", function () {

			it("should return summerWidget1Needs", function () {
				assert.deepEqual(summerWidget1Needs, needs.getNeedsByName(["Comparison", "Overtime"]));
			});

			it("should return summerWidget2Needs", function () {
				assert.deepEqual(summerWidget2Needs, needs.getNeedsByName(["Comparison", "Overtime", "Proportion"]));
			});

			it("should return summerWidget34Needs", function () {
				assert.deepEqual(summerWidget34Needs, needs.getNeedsByName(["See status"]));
			});
		});

		it ("should return an empty need array", function () {
			assert.deepEqual([], needs.getNeedsByName(["Truc", "Bidule"]));
		});
	});

	describe("#getSensorsMatchingNeeds()", function () {

		describe("summer dashboard", function () {

			it("should return all sensor categories", function (done) {
				async.each([summerWidget1Needs, summerWidget2Needs], function iterator (item, callback) {
					needs.getSensorsMatchingNeeds(item, function (err, results) {
						if(err) {
							logger.error(err);
							throw err;
						}
						assert.equal(Object.keys(SENSOR_CATEGORIES).length, results.length);
						for (var category in SENSOR_CATEGORIES) {
							assert(results.find(function predicate(element, index, array) {
								return element.set === category;
							}));
						}
						for (var i = results.length - 1; i >= 0; i--) {
							assert(Array.isArray(results[i].sensors));
						};
						// TODO mock and test content? that would be very expensive...
						logger.debug(results);
						callback(null);
					})
				}, function join (err) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
			});

			it("should return NUMBER category", function (done) {
				needs.getSensorsMatchingNeeds(summerWidget34Needs, function (err, results) {
					if(err) {
						logger.error(err);
						throw err;
					}
					assert.equal(1, results.length);
					assert.equal(SENSOR_CATEGORIES.NUMBER, results[0].set);
					assert(Array.isArray(results[0].sensors));
					logger.debug(results[0].sensors);
					done();
				});
			});
		});

		// TODO other dashboards?
	});

	describe("#getNeedsMatchingSensors", function () {

		function testGetNeedsMatchingSensors(sensors, expectedNeeds, only, done) {
			needs.getNeedsMatchingSensors(sensors, function (err, results) {
				if (err) {
					logger.error(err);
					throw err;
				}
				else {
					if (only) {
						assert.equal(expectedNeeds.length, results.length);
					}
					expectedNeeds.forEach(function (expected) {
						assert(results.find(function (result) {
							return result.name === expected.name;
						}));
					});
					done();
				}
			});
		}

		describe("summer dashboard", function () {

			var temp443V = { name: "TEMP_443V", category: SENSOR_CATEGORIES.TEMP },
				tempCampus = { name: "TEMP_CAMPUS", category: SENSOR_CATEGORIES.TEMP },
				ac443State = { name: "AC_443STATE", category: SENSOR_CATEGORIES.NUMBER },
				window443State = { name: "WINDOW443STATE", category: SENSOR_CATEGORIES.NUMBER };

			it("should return Comparison and Overtime needs", function (done) {
				async.parallel([
					function (callback) {
						testGetNeedsMatchingSensors([temp443V], [NEEDS.COMPARISON, NEEDS.OVERTIME],
							false, function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([tempCampus], [NEEDS.COMPARISON, NEEDS.OVERTIME],
							false, function () {
							callback(null);
						});
					}
				], function join (err, results) {
					done();
				});
			});

			// it("should return ONLY Comparison and Overtime needs", function (done) {
			// 	testGetNeedsMatchingSensors([temp443V, tempCampus],
			// 		[NEEDS.COMPARISON, NEEDS.OVERTIME], true, done);
			// });

			it("should return Comparison, Overtime and Proportion needs", function (done) {
				async.parallel([
					function (callback) {
						testGetNeedsMatchingSensors([ac443State],
							[NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION], false,
							function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([window443State],
							[NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION], false,
							function () {
							callback(null);
						});
					}
				], function join (err, results) {
					done();
				});
			});

			// it("should return ONLY Comparison, Overtime and Proportion needs", function (done) {
			// 	testGetNeedsMatchingSensors([ac443State, window443State],
			// 		[NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION], true, done);
			// });

			it("should return See Status need", function (done) {
				async.parallel([
					function (callback) {
						testGetNeedsMatchingSensors([ac443State], [NEEDS.SEE_STATUS],
							false, function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([window443State], [NEEDS.SEE_STATUS],
							false, function () {
							callback(null);
						});
					}
				], function join (err, results) {
					done();
				});
			});
		});
	});
});
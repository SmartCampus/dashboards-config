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
	summerWidget34Needs = [NEEDS.SEE_STATUS];

var unconsistentNeeds = [NEEDS.COMPARISON, NEEDS.RELATIONSHIPS, NEEDS.SUMMARIZE];

var surroundingWidget12Needs = [NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.RELATIONSHIPS],
	surroundingWidget34Needs = [NEEDS.PROPORTION],
	surroundingWidget56Needs = [NEEDS.OVERTIME, NEEDS.PATTERN];

var winterWidget1Needs = [NEEDS.SEE_STATUS],
	winterWidget2Needs = [NEEDS.OVERTIME],
	winterWidget3Needs = [NEEDS.OVERTIME, NEEDS.COMPARISON, NEEDS.RELATIONSHIPS];

var overviewNeeds = [NEEDS.LOCATION];

describe("needs", function () {

	describe("#getSensorsMatchingNeeds()", function () {

		it("should produce an unconsistent need set error", function () {
			needs.getSensorsMatchingNeeds(unconsistentNeeds, function (err, results) {
				assert(err);
				assert(err.unconsistentNeedSet);
				assert(!results);
			});
		});

		describe("summer dashboard", function () {

			it("should return all sensor categories", function (done) {
				async.each([summerWidget1Needs, summerWidget2Needs], function iterator (item, callback) {
					needs.getSensorsMatchingNeeds(item, function (err, results) {
						if(err) {
							logger.error(err);
							throw err;
						}
						assert.equal(Object.keys(SENSOR_CATEGORIES).length - 1, results.length);
						for (var category in SENSOR_CATEGORIES) {
							if (category != "ALL") {
								assert(results.find(function predicate(element, index, array) {
									return element.set === category;
								}));
							}
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

			it("should return only STATE category", function (done) {
				needs.getSensorsMatchingNeeds(summerWidget34Needs, function (err, results) {
					if(err) {
						logger.error(err);
						throw err;
					}
					assert.equal(1, results.length);
					assert.equal(SENSOR_CATEGORIES.STATE, results[0].set);
					assert(Array.isArray(results[0].sensors));
					logger.debug(results[0].sensors);
					done();
				});
			});
		});

		describe("surrounding dashboard", function () {

			it("it should return STATE and SOUND categories", function (done) {
				var categories = [SENSOR_CATEGORIES.STATE, SENSOR_CATEGORIES.SOUND];

				needs.getSensorsMatchingNeeds(surroundingWidget12Needs, function (err, results) {
					if(err) {
						logger.error(err);
						throw err;
					}
					assert(categories.length <= results.length);
					categories.forEach(function (category) {
						assert(results.find(function predicate(result) {
							return result.set == category;
						}));
					});
					results.forEach(function (result) {
						assert(Array.isArray(result.sensors));
					});
					logger.debug(results);
					done();
				});
			});

			it("should return STATE category", function (done) {
				needs.getSensorsMatchingNeeds(surroundingWidget34Needs, function (err, results) {
					var actual;

					if(err) {
						logger.error(err);
						throw err;
					}
					assert(1 <= results.length);
					actual = results.find(function predicate(result) {
						return result.set == SENSOR_CATEGORIES.STATE;
					});
					assert(actual);
					assert(Array.isArray(actual.sensors));
					logger.debug(actual.sensors);
					done();
				});
			});

			it("should return only STATE category", function (done) {
				needs.getSensorsMatchingNeeds(surroundingWidget56Needs, function (err, results) {
					var actual;

					if(err) {
						logger.error(err);
						throw err;
					}
					assert.equal(1, results.length);
					assert.equal(SENSOR_CATEGORIES.STATE, results[0].set);
					assert(Array.isArray(results[0].sensors));
					logger.debug(results[0].sensors);
					done();
				});
			});
		});

		describe("winter dashboard", function () {

			it("should return only STATE category", function (done) {
				needs.getSensorsMatchingNeeds(winterWidget1Needs, function (err, results) {
					var actual;

					if(err) {
						logger.error(err);
						throw err;
					}
					assert.equal(1, results.length);
					assert.equal(SENSOR_CATEGORIES.STATE, results[0].set);
					assert(Array.isArray(results[0].sensors));
					logger.debug(results[0].sensors);
					done();
				});
			});

			it("should return LIGHT category", function (done) {
				needs.getSensorsMatchingNeeds(winterWidget2Needs, function (err, results) {
					var actual;

					if(err) {
						logger.error(err);
						throw err;
					}
					assert(1 <= results.length);
					actual = results.find(function predicate(result) {
						return result.set == SENSOR_CATEGORIES.LIGHT;
					});
					assert(actual);
					assert(Array.isArray(actual.sensors));
					logger.debug(actual.sensors);
					done();
				});
			});

			it("should return TEMP and STATE categories", function (done) {
				var categories = [SENSOR_CATEGORIES.TEMP, SENSOR_CATEGORIES.STATE];

				needs.getSensorsMatchingNeeds(winterWidget3Needs, function (err, results) {
					if(err) {
						logger.error(err);
						throw err;
					}
					assert(categories.length <= results.length);
					categories.forEach(function (category) {
						assert(results.find(function predicate(result) {
							return result.set == category;
						}));
					});
					results.forEach(function (result) {
						assert(Array.isArray(result.sensors));
					});
					logger.debug(results);
					done();
				});
			});

			// TODO only?
		});

		describe("overview dashboard", function () {
			var categories = SENSOR_CATEGORIES.ALL;

			it("should return all sensor categories", function (done) {
				needs.getSensorsMatchingNeeds(overviewNeeds, function (err, results) {
					if (err) {
						logger.error(err);
						throw err;
					}
					assert(categories.length === results.length);
					categories.forEach(function (category) {
						assert(results.find(function predicate(result) {
							return result.set == category;
						}));
					});
					results.forEach(function (result) {
						assert(Array.isArray(result.sensors));
					});
					logger.debug(results);
					done();
				});
			});
		});
	});
});
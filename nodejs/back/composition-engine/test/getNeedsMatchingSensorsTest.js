/**
 * @author Marc Karassev
 */

var assert = require("assert"),
	async = require("async"),
	needs = require("../needs"),
	logger = require("../logger");

var NEEDS = needs.NEEDS,
	SENSOR_CATEGORIES = needs.SENSOR_CATEGORIES;

var temp443V = { name: "TEMP_443V", category: "temp" },
	tempCampus = { name: "TEMP_CAMPUS", category: SENSOR_CATEGORIES.TEMP },
	ac443State = { name: "AC_443STATE", category: SENSOR_CATEGORIES.STATE },
	window443State = { name: "WINDOW443STATE", category: SENSOR_CATEGORIES.STATE },
	noiseSparksCorridor = { name: "NOISE_SPARKS_CORRIDOR", category: SENSOR_CATEGORIES.SOUND },
	door443State = { name: "DOOR443STATE", category: SENSOR_CATEGORIES.STATE },
	light444 = { name: "LIGHT_444", category: SENSOR_CATEGORIES.LIGHT },
	heating443 = { name: "HEATING_443", category: SENSOR_CATEGORIES.STATE },
	allSensors = [temp443V, tempCampus, ac443State, window443State, noiseSparksCorridor,
		door443State, light444, heating443];

describe("needs", function () {

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
					results.forEach(function (result) {
						logger.debug(result.name);
					});
					done();
				}
			});
		}

		it("should produce an invalidCategories error", function (done) {
			needs.getNeedsMatchingSensors([{ category: "not a category" }], function (err, results) {
				assert(err);
				assert(err.invalidCategories);
				assert(!results);
				done();
			});
		});

		describe("summer dashboard", function () {

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
							[NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION], false, function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([window443State],
							[NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.PROPORTION], false, function () {
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

		describe("surrounding dashboard", function () {

			it("should return Comparison, Overtime and Relationships needs", function (done) {
				var needs = [NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.RELATIONSHIPS];

				async.parallel([
					function (callback) {
						testGetNeedsMatchingSensors([noiseSparksCorridor, door443State], needs, false,
							function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([noiseSparksCorridor, window443State], needs, false,
							function () {
							callback(null);
						});
					}
				], function join (err, results) {
					done();
				});
			});

			it("should return Proportion need", function (done) {
				async.parallel([
					function (callback) {
						testGetNeedsMatchingSensors([door443State], [NEEDS.PROPORTION], false, function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([window443State], [NEEDS.PROPORTION], false, function () {
							callback(null);
						});
					}
				], function join (err, results) {
					done();
				});
			});

			it("should return Overtime and Pattern needs", function (done) {
				var needs = [NEEDS.OVERTIME, NEEDS.PATTERN];

				async.parallel([
					function (callback) {
						testGetNeedsMatchingSensors([door443State], needs, false, function () {
							callback(null);
						});
					},
					function (callback) {
						testGetNeedsMatchingSensors([window443State], needs, false, function () {
							callback(null);
						});
					}
				], function join (err, results) {
					done();
				});
			});
		});

		describe("winter dashboard", function () {

			it("should return See Status need", function (done) {
				testGetNeedsMatchingSensors([heating443], [NEEDS.SEE_STATUS], false, function () {
					done();
				});
			});

			it("should return Overtime need", function (done) {
				testGetNeedsMatchingSensors([light444], [NEEDS.OVERTIME], false, function () {
					done();
				});
			});

			it("should return Overtime, Comparison and Relationships needs", function (done) {
				var needs = [NEEDS.OVERTIME, NEEDS.COMPARISON, NEEDS.RELATIONSHIPS];

				testGetNeedsMatchingSensors([heating443, temp443V, tempCampus], needs, false, function () {
					done();
				});
			});
		});

		describe("overiew dashboard", function () {

			it("should return Location need", function (done) {
				testGetNeedsMatchingSensors(allSensors, [NEEDS.LOCATION], false, function () {
					done();
				});
			});
		});
	});
});
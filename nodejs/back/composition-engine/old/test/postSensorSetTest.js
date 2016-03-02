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

describe("composition engine", function () {

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
					results.forEach(function (result) {
						logger.debug(result.name);
					});
				})
				.end(callback);
		}

		it("should respond with a 400 flag while sending invalid sensors", function (done) {
			async.parallel([
				function (callback) {
					request(app)
						.post(sensorSetPath)
						.send("This is not the expected JSON.")
						.expect(400)
						.expect(function (response) {
							assert(response.body.invalidJson);
						})
						.end(callback);
				},
				function (callback) {
					request(app)
						.post(sensorSetPath)
						.send({ sensres: []})
						.expect(400)
						.expect(function (response) {
							assert(response.body.invalidJson);
						})
						.end(callback);
				},
				function (callback) {	
					request(app)
						.post(sensorSetPath)
						.send({ sensors: "This is not an array."})
						.expect(400)
						.expect(function (response) {
							assert(response.body.invalidJson);
						})
						.end(callback);
				},
				function (callback) {
					request(app)
						.post(sensorSetPath)
						.send({ sensors: [ "This is not a sensor.", "This isn't a sensor either."]})
						.expect(400)
						.expect(function (response) {
							assert(response.body.invalidJson);
						})
						.end(callback);
				},
				function (callback) {
					request(app)
						.post(sensorSetPath)
						.send({ sensors: [{ catgries: "" }]})
						.expect(400)
						.expect(function (response) {
							assert(response.body.invalidJson);
						})
						.end(callback);
				}
			], function join (err, results) {
				logger.debug(err);
				assert(!err);
				done();
			});
		});

		it("should respond with a 400 flag while sending sensors with invalid categories", function (done) {
			request(app)
				.post(sensorSetPath)
				.send({ sensors: [{ category: "this is not a sensor category" }] })
				.expect(400)
				.expect(function (response) {
					logger.debug(response.body);
					assert(response.body.invalidCategories);
				})
				.end(done);
		});

		describe("summer dashboard", function () {

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
		});

		describe("surrounding dashboard", function () {

			it("should get Comparison, Overtime and Relationship needs", function (done) {
				var needs = [NEEDS.COMPARISON, NEEDS.OVERTIME, NEEDS.RELATIONSHIPS],
					requestsBodies = [[noiseSparksCorridor, door443State],
									  [noiseSparksCorridor, window443State]];
				
				async.each(requestsBodies, function iterator (item, callback) {
					testPostSensorSet({ sensors: item }, needs, function () {
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

			it("should return Proportion need", function (done) {
				var requestsBodies = [[door443State], [window443State]];
				
				async.each(requestsBodies, function iterator (item, callback) {
					testPostSensorSet({ sensors: item }, [NEEDS.PROPORTION], function () {
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

			it("should return Overtime and Pattern needs", function (done) {
				var needs = [NEEDS.OVERTIME, NEEDS.PATTERN],
					requestsBodies = [[door443State], [window443State]];
				
				async.each(requestsBodies, function iterator (item, callback) {
					testPostSensorSet({ sensors: item }, needs, function () {
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
		});

		describe("winter dashboard", function () {

			it("should return See Status need", function (done) {
				testPostSensorSet({ sensors: [heating443] }, [NEEDS.SEE_STATUS], function () {
					done();
				});
			});

			it("should return Overtime need", function (done) {
				testPostSensorSet({ sensors: [light444] }, [NEEDS.OVERTIME], function () {
					done();
				});
			});

			it("should get Overtime, Comparison and Relationship needs", function (done) {
				var needs = [NEEDS.OVERTIME, NEEDS.COMPARISON, NEEDS.RELATIONSHIPS],
					sensors = [temp443V, tempCampus, heating443];
				
				testPostSensorSet({ sensors: sensors }, needs, function () {
					done();
				});
			});
		});

		describe("overview dashboard", function () {

			it("should get Location need", function (done) {
				testPostSensorSet({ sensors: allSensors }, [NEEDS.LOCATION], function () {
					done();
				});
			});
		});
	});
});

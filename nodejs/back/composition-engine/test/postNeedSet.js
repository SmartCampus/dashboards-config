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

		it("should respond with a 400 flag with an inconsistent need set", function (done) {
			request(app)
				.post(needSetPath)
				.send(unconsistentNeeds)
				.expect(400)
				.expect(function (response) {
					assert(response.body.unconsistentNeedSet);
				})
				.end(done);
		});

		it("should respond with a 400 flag while sending a nonexistent need", function (done) {
			request(app)
				.post(needSetPath)
				.send(["Comprison", "Overtime"])
				.expect(400)
				.expect(function (response) {
					assert(response.body.incorrectNeeds);
				})
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

			it("should return only STATE category", function (done) {
				request(app)
					.post(needSetPath)
					.send(summerWidget34Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body;

						assert.equal(1, results.length);
						assert.equal(SENSOR_CATEGORIES.STATE, results[0].set);
						assert(Array.isArray(results[0].sensors));
						logger.debug(results[0].sensors);
					})
					.end(done);
			});
		});

		describe("surrounding dashboard", function () {

			var surroundingWidget12Needs = { needs: [NEEDS.COMPARISON.name, NEEDS.OVERTIME.name,
					NEEDS.RELATIONSHIPS.name] },
				surroundingWidget34Needs = { needs: [NEEDS.PROPORTION.name] },
				surroundingWidget56Needs = { needs: [NEEDS.OVERTIME.name, NEEDS.PATTERN.name] };

			it("it should return STATE and SOUND categories", function (done) {
				var categories = [SENSOR_CATEGORIES.STATE, SENSOR_CATEGORIES.SOUND];

				request(app)
					.post(needSetPath)
					.send(surroundingWidget12Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body;

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
					})
					.end(done);
			});

			it("should return STATE category", function (done) {
				request(app)
					.post(needSetPath)
					.send(surroundingWidget56Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body, actual;

						assert(1 <= results.length);
						actual = results.find(function predicate(result) {
							return result.set == SENSOR_CATEGORIES.STATE;
						});
						assert(actual);
						assert(Array.isArray(actual.sensors));
						logger.debug(actual.sensors);
					})
					.end(done);
			});

			it("should return only STATE category", function (done) {
				request(app)
					.post(needSetPath)
					.send(surroundingWidget56Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body;

						assert.equal(1, results.length);
						assert.equal(SENSOR_CATEGORIES.STATE, results[0].set);
						assert(Array.isArray(results[0].sensors));
						logger.debug(results[0].sensors);
					})
					.end(done);
			});
		});

		describe("winter dashboard", function () {

			var winterWidget1Needs = { needs: [NEEDS.SEE_STATUS.name] },
				winterWidget2Needs = { needs: [NEEDS.OVERTIME.name] },
				winterWidget3Needs = { needs: [NEEDS.OVERTIME.name, NEEDS.COMPARISON.name, NEEDS.RELATIONSHIPS.name] };

			it("should return only STATE category", function (done) {
				request(app)
					.post(needSetPath)
					.send(winterWidget1Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body;

						assert.equal(1, results.length);
						assert.equal(SENSOR_CATEGORIES.STATE, results[0].set);
						assert(Array.isArray(results[0].sensors));
						logger.debug(results[0].sensors);
					})
					.end(done);
			});

			it("should return LIGHT category", function (done) {
				request(app)
					.post(needSetPath)
					.send(winterWidget2Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body, actual;

						assert(1 <= results.length);
						actual = results.find(function predicate(result) {
							return result.set == SENSOR_CATEGORIES.LIGHT;
						});
						assert(actual);
						assert(Array.isArray(actual.sensors));
						logger.debug(actual.sensors);
					})
					.end(done);
			});

			it("it should return STATE and TEMP categories", function (done) {
				var categories = [SENSOR_CATEGORIES.STATE, SENSOR_CATEGORIES.TEMP];

				request(app)
					.post(needSetPath)
					.send(winterWidget3Needs)
					.expect(200)
					.expect(function (response) {
						var results = response.body;

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
					})
					.end(done);
			});
		});
	});
});
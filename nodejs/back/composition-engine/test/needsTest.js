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

	describe("#getSensorsMatchingNeeds()", function () {

		describe("summer dashboard", function () {

			it("should return all sensor categories", function (done) {
				needs.getSensorsMatchingNeeds(summerWidget1Needs, function (err, results) {
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
					logger.info(results);
					done();
				});
			});
		});

		// TODO other dasboards?
	});
});
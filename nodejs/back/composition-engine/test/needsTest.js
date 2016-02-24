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

	describe.only("#checkNeedsConsistency()", function () {

		describe("summer dashboard", function () {

			it("widget 1 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(summerWidget1Needs));
			});

			it("widget 2 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(summerWidget2Needs));
			});

			it("widget 34 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(summerWidget34Needs));
			});
		});

		describe("surrounding dashboard", function () {

			it("widget 12 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(surroundingWidget12Needs));
			});

			it("widget 34 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(surroundingWidget34Needs));
			});

			it("widget 56 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(surroundingWidget56Needs));
			});
		});

		describe("winter dashboard", function () {

			it("widget 1 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(winterWidget1Needs));
			});

			it("widget 2 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(winterWidget2Needs));
			});

			it("widget 3 needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(winterWidget3Needs));
			});
		});

		describe("overview dashboard", function () {

			it("overview needs should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency(overviewNeeds));
			});
		})

		it("should not be a consistent need set", function () {
			assert(!needs.checkNeedsConsistency(unconsistentNeeds));
		});

		it("should not be a consistent need set when another need is composed with Location", function () {
			for (var property in NEEDS) {
				if (!(property === "LOCATION" || property === "ALL")) {
					assert(!needs.checkNeedsConsistency([NEEDS.LOCATION, NEEDS[property]]));
				}
			}
		});
	});

	describe("#getNeedsByName()", function () {

		it("should return an empty array", function () {
			assert.deepEqual(needs.getNeedsByName(["Comprison", "Overtime"]), []);
			assert.deepEqual(needs.getNeedsByName([]), []);
		});

		it("should return Comparison and Overtime needs", function () {
			assert.deepEqual(needs.getNeedsByName(["cOmpARIson", "OVERTIME"]), [NEEDS.COMPARISON, NEEDS.OVERTIME]);
		});

		describe("summer dashboard", function () {

			it("should return summerWidget1Needs", function () {
				assert.deepEqual(summerWidget1Needs, needs.getNeedsByName(["Comparison", "Overtime"]));
			});

			it("should return summerWidget2Needs", function () {
				assert.deepEqual(summerWidget2Needs, needs.getNeedsByName(["Comparison", "Overtime", "Proportion"]));
			});

			it("should return summerWidget34Needs", function () {
				assert.deepEqual(summerWidget34Needs, needs.getNeedsByName(["See Status"]));
			});
		});

		describe("surrounding dashboard", function () {

			it("should return surroundingWidget12Needs", function () {
				assert.deepEqual(surroundingWidget12Needs, needs.getNeedsByName(["Comparison", "Overtime", "Relationships"]));
			});

			it("should return surroundingWidget34Needs", function () {
				assert.deepEqual(surroundingWidget34Needs, needs.getNeedsByName(["Proportion"]));
			});

			it("should return surroundingWidget56Needs", function () {
				assert.deepEqual(surroundingWidget56Needs, needs.getNeedsByName(["Overtime", "Pattern"]));
			});
		});

		describe("winter dashboard", function () {

			it("should return winterWidget1Needs", function () {
				assert.deepEqual(winterWidget1Needs, needs.getNeedsByName(["See Status"]));
			});

			it("should return winterWidget2Needs", function () {
				assert.deepEqual(winterWidget2Needs, needs.getNeedsByName(["Overtime"]));
			});

			it("should return winterWidget3Needs", function () {
				assert.deepEqual(winterWidget3Needs, needs.getNeedsByName(["Overtime", "Comparison", "Relationships"]));
			});
		});

		it ("should return an empty need array", function () {
			assert.deepEqual([], needs.getNeedsByName(["Truc", "Bidule"]));
		});
	});
});
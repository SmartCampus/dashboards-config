var assert = require("assert")
	needs = require("../needs"),
	logger = require("../logger");

var NEEDS = needs.NEEDS;

describe("needs", function () {

	describe("#checkNeedsConsistency()", function () {

		describe("summer dashobard", function () {

			it("should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency([
					NEEDS.COMPARISON,
					NEEDS.OVERTIME
				]));
			});

			it("should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency([
					NEEDS.COMPARISON,
					NEEDS.OVERTIME,
					NEEDS.PROPORTION
				]));
			});

			it("should be a consistent need set", function () {
				assert(needs.checkNeedsConsistency([
					NEEDS.SEE_STATUS
				]));
			});
		});

		it("should not be a consistent need set", function () {
			assert(!needs.checkNeedsConsistency([
				NEEDS.COMPARISON,
				NEEDS.RELATIONSHIPS,
				NEEDS.SUMMARIZE
			]));
		});
	});
});
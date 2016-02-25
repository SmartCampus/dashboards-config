/**
 * @author Marc Karassev
 *
 * Composition engine service public API tests.
 */

var request = require("supertest"),
	async = require("async"),
	assert = require("assert"),
	app = require("../app"),
	logger = require("../logger");

describe("composition engine", function () {

	describe("POST composition data", function () {

		var compositionDataPath = "/composition_data";

		describe("summer dashboard", function () {

			// var summerWidget1Needs = [NEEDS.COMPARISON.name, NEEDS.OVERTIME.name],
			// 	summerWidget2Needs = [NEEDS.COMPARISON.name, NEEDS.OVERTIME.name,
			// 		NEEDS.PROPORTION.name],
			// 	summerWidget34Needs = [NEEDS.SEE_STATUS.name];

			// TODO
		});

		describe("surrounding dashboard", function () {

			// TODO
		});

		describe("winter dashboard", function () {

			// TODO
		});

		describe("overview dashboard", function () {

			// TODO
		});
	});
});
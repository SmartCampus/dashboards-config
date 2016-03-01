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

var PATTERNS = "Patterns",
	DATA_OVER_TIME = "Data over time",
	COMPARISONS = "Comparisons",
	RELATIONSHIPS = "Relationships",
	DISTRIBUTION = "Distribution",
	PART_TO_A_WHOLE = "Part to a whole",
	PROPORTIONS = "Proportions",
	LOCATION = "Location",
	STATE = "State";

var NEEDS = [PATTERNS, DATA_OVER_TIME, COMPARISONS, RELATIONSHIPS, DISTRIBUTION, PART_TO_A_WHOLE,
	PROPORTIONS, LOCATION, STATE];

var LINE = "line",
	COLUMN = "column",
	PIE = "pieChart",
	SCATTERPLOT = "scatterplot",
	MAP = "map",
	BOOLEAN = "boolean",
	MIX = "mix";

var WIDGETS = [LINE, COLUMN, PIE, SCATTERPLOT, MAP, BOOLEAN, MIX];

describe("composition engine API", function () {

	before(function (done) {
		app.on("ready", function () {
			logger.info("composition engine ready");
			done();
		});
	});

	describe("POST composition data", function () {

		var compositionDataPath = "/composition_data";

		function testCompose(needs, sensors, expectedNeeds, checkAccept, expectedWidgets, strictly, callback) {
			request(app)
				.post(compositionDataPath)
				.send({
					needs: needs,
					sensors: sensors
				})
				.expect(200)
				.expect(function (response) {
					var result = response.body;

					// logger.debug("result.needs:", result.needs);
					// logger.debug("expected needs:", expectedNeeds);
					// logger.debug("result.widgets:", result.widgets);
					assert(result.needs.length >= expectedNeeds.length);
					for (var i in expectedNeeds) {
						assert(result.needs.indexOf(expectedNeeds[i]) > -1);
					}
					if (checkAccept) {
						assert.strictEqual(result.acceptMoreSensors, checkAccept.expected);
					}
					if (strictly) {
						assert.strictEqual(result.widgets[0].widget, expectedWidgets[0]);
					}
					else {
						for (var i in expectedWidgets) {
							assert(result.widgets.indexOf(expectedWidgets[i] > -1));
						}
					}
				})
				.end(callback);
		}

		// TODO error cases

		it("should get both grouped and not grouped needs", function (done) {
			testCompose([PATTERNS], [1], [DATA_OVER_TIME, COMPARISONS, RELATIONSHIPS],
				{ expected: true }, [LINE], false, done);
		});

		it("should get only grouped needs", function (done) {
			testCompose([PATTERNS, DATA_OVER_TIME], [1, 2], [COMPARISONS, RELATIONSHIPS],
				{ expected: true }, [LINE], false, done);
		});

		it("should accept more sensors", function (done) {
			testCompose([PATTERNS], [1], [], { expected: true }, [], false, function () {
				testCompose([PATTERNS], [], [], { expected: true }, [], false, done);
			});
		});

		it("should not accept more sensors", function (done) {
			testCompose([PART_TO_A_WHOLE], [1], [], { expected: false }, [], false, done);
		});

		function testWidgetNeedsRec(inputNeeds, ouputNeeds, sensors, expectedWidget, callback) {
			async.each(ouputNeeds, function (need, cb) {
				var needs, expectedNeeds;

				needs = inputNeeds.slice();
				needs.push(need);
				expectedNeeds = ouputNeeds.slice();
				expectedNeeds.splice(ouputNeeds.indexOf(need), 1);
				// logger.debug("in:", needs);
				// logger.debug("out:", expectedNeeds);
				if (expectedNeeds.length === 0) {
					testCompose(needs, sensors, expectedNeeds, null, [expectedWidget], true, function () {
						// logger.debug("endrec");
						cb();
					});
				}
				else {
					testCompose(needs, sensors, expectedNeeds, null, [expectedWidget], false, function () {
						// logger.debug("rec");
						testWidgetNeedsRec(needs, expectedNeeds, sensors, expectedWidget, cb);
					});
				}
			}, function join(err) {
				if (err) {
					logger.error(err);
					throw err;
				}
				callback();
			});
		}

		function testWidget(needs, sensors, widget, callback) {
			var inputNeeds, ouputNeeds;

			testWidgetNeedsRec([], needs, sensors, widget, callback);
		}

		describe("Summer Dashboard", function () {

			it("should successively match widget 1 needs and finally line widget", function (done) {
				testWidget([RELATIONSHIPS, DATA_OVER_TIME, COMPARISONS, PATTERNS], [1, 2],
					LINE, done);
			});
			
			it("should successively match widget 2 needs and finally column widget", function (done) {
				testWidget([RELATIONSHIPS, DISTRIBUTION, COMPARISONS, PATTERNS], [1, 2],
					COLUMN, done);
			});
			
			it("should successively match widget 3 and 4 needs and finally boolean widget",
					function (done) {
				testWidget([STATE], [1], BOOLEAN, done);
			});
		});

		describe("Surrounding Dashboard", function () {

			it("should successively match widget 1 and 2 needs and finally mix widget", function (done) {
				testWidget([RELATIONSHIPS, DATA_OVER_TIME, COMPARISONS, PATTERNS, DISTRIBUTION],
					[1, 2], MIX, done);
			});
			
			it("should successively match widget 3 and 4 needs and finally pie widget", function (done) {
				testWidget([PROPORTIONS, PART_TO_A_WHOLE, COMPARISONS], [1], PIE, done);
			});

			it("should successively match widget 5 and 6 needs and finally scatterplot widget",
					function (done) {
				testWidget([PATTERNS, RELATIONSHIPS], [1], SCATTERPLOT, done);
			});
		});

		describe("Winter Dashboard", function () {

			it("should successively match widget 1 needs and finally boolean widget", function (done) {
				testWidget([STATE], [1], BOOLEAN, done);
			});
			
			it("should successively match widget 2 needs and finally boolean widget", function (done) {
				testWidget([STATE], [1], BOOLEAN, done);
			});

			it("should successively match widget 3 needs and finally mix widget", function (done) {
				testWidget([RELATIONSHIPS, DATA_OVER_TIME, COMPARISONS, PATTERNS, DISTRIBUTION],
					[1, 2, 3], MIX, done);
			});
		});

		describe("Overview Dashboard", function () {

			it("should successively match widget 1 needs and finally map widget", function (done) {
				testWidget([PATTERNS, LOCATION, DISTRIBUTION], [1, 2, 3, 4, 5, 6, 7, 8], MAP, done);
			});
		});
	});
});
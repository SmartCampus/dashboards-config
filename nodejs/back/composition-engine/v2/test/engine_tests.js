/**
 * @author Marc Karassev
 *
 * Tests for composition engine. 
 */

var engine = require("../engine"),
	assert = require("assert"),
	async = require("async"),
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

describe("composition engine", function () {

	before(function (done) {
		var	needs, widgets, widget;

		engine.init(function (err) {
			assert(!err);
			needs = engine.getNeeds();
			widgets = engine.getWidgets();
			assert(needs.length >= NEEDS.length);
			for (var i in NEEDS) {
				assert(needs.indexOf(NEEDS[i]) > -1);
			}
			assert(widgets.length >= WIDGETS.length)
			for (var i in widgets) {
				widget = widgets[i];
				assert(WIDGETS.find(function (name) {
					return name === widget.name;
				}));
				assert(Array.isArray(widget.functions));
				assert(Array.isArray(widget.whenGroupedFunctions));
			}
			done();
		});
	});

	after(function (done) {
		done();
	});

	describe("#compose()", function () {

		function testCompose(needs, sensors, expectedNeeds, expectedWidgets, strictly, callback) {
			engine.compose(needs, sensors, function (err, result) {
				assert(!err);
				if (strictly) {
					assert(result.needs.length === expectedNeeds.length);
					assert(result.widgets[0].name === expectedWidgets[0]);
				}
				else {
					assert(result.needs.length >= expectedNeeds.length);
					for (var i in expectedWidgets) {
						assert(result.widgets.indexOf(expectedWidgets[i] > -1));
					}
				}
				for (var i in expectedNeeds) {
					assert(result.needs.indexOf(expectedNeeds[i]) > -1);
				}
				callback();
			});
		}

		function testWidgetNeedsRec(inputNeeds, ouputNeeds, sensors, expectedWidget, callback) {
			if (ouputNeeds.length === 1) {
				// logger.debug("rec end");
				callback();
			}
			else {
				async.each(ouputNeeds, function (need, cb) {
					var needs, expectedNeeds;

					needs = inputNeeds.slice();
					needs.push(need);
					expectedNeeds = ouputNeeds.slice();
					expectedNeeds.splice(ouputNeeds.indexOf(need), 1);
					// logger.debug("in:", needs);
					// logger.debug("out:", expectedNeeds);
					// logger.debug("rec");
					testCompose(needs, sensors, expectedNeeds, [expectedWidget], false, function () {
						testWidgetNeedsRec(needs, expectedNeeds, sensors, expectedWidget, cb);
					});
				}, function join(err) {
					if (err) {
						logger.error(err);
						throw err;
					}
					callback();
				});
			}
		}

		function testWidget(needs, sensors, widget, callback) {
			var inputNeeds, ouputNeeds;

			testWidgetNeedsRec([], needs, sensors, widget, callback);
		}

		describe("Summer Dashboard", function () {

			describe("widget 1", function () {

				var widget1Needs = [RELATIONSHIPS, DATA_OVER_TIME, COMPARISONS, PATTERNS];

				it("should successively match widget 1 needs", function (done) {
					testWidget(widget1Needs, [1, 2], LINE, done);
				});
			});
		});
	});
});
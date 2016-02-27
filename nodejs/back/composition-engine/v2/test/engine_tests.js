/**
 * @author Marc Karassev
 *
 * Tests for composition engine. 
 */

var engine = require("../engine"),
	assert = require("assert"),
	async = require("async"),
	logger = require("../logger");

var NEEDS, WIDGETS;

describe("composition engine", function () {

	before(function (done) {
		var expectedNeeds = ["Patterns", "Data over time", "Comparisons", "State",
			"Relationships", "Distribution", "Part to a whole", "Proportions",
			"Location"],
			widget, expectedWidgetNames = ["Line Graph", "Bar Chart", "Pie Chart",
			"Scatterplot", "Dot Map", "Boolean", "Line and Bar Chart"];

		engine.init(function (err) {
			assert(!err);
			NEEDS = engine.getNeeds();
			WIDGETS = engine.getWidgets();
			assert(NEEDS.length >= expectedNeeds.length)
			for (var i in expectedNeeds) {
				assert(NEEDS.find(function (element) {
					return element === expectedNeeds[i];
				}));
			}
			assert(WIDGETS.length >= expectedWidgetNames.length)
			for (var i in WIDGETS) {
				widget = WIDGETS[i];
				assert(expectedWidgetNames.find(function (name) {
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

	it("pending...", function (done) {
		done();
	});
});
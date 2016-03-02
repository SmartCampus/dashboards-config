/**
 * @author Marc Karassev
 *
 * Tests for visualization catalog requester. 
 */

var catalogRequester = require("../visualization_catalog_requester"),
	assert = require("assert"),
	async = require("async"),
	logger = require("../logger");

describe("visualization catalog requester", function () {

	it("should produce an error when the catalog is unreachable", function (done) {
		async.parallel([
			function (callback) {
				catalogRequester.getVisualizationFunctions(function (err, functions) {
					if (err) {
						assert(err.whileReachingCatalog);
						assert(!functions);
					}
					callback();
				});
			},
			function (callback) {
				catalogRequester.getCharts(function (err, functions) {
					if (err) {
						assert(err.whileReachingCatalog);
						assert(!functions);
					}
					callback();
				});
			},
			function (callback) {
				catalogRequester.getRatedCharts([], false, function (err, functions) {
					if (err) {
						assert(err.whileReachingCatalog);
						assert(!functions);
					}
					callback();
				});
			}
		], function join (err, results) {
			if (err) {
				logger.error(err);
				throw err;
			}
			done()
		});
	});

	it("should get all visualization functions", function (done) {
		var expectedFunctions = ["Patterns", "Data over time", "Comparisons", "State",
			"Relationships", "Distribution", "Part to a whole", "Proportions",
			"Location"];

		catalogRequester.getVisualizationFunctions(function (err, functions) {
			assert(!err);
			assert(functions.length >= expectedFunctions.length)
			for (var i in expectedFunctions) {
				assert(functions.find(function (element) {
					return element === expectedFunctions[i];
				}));
			}
			done();
		});
	});

	it("should get all charts", function (done) {
		var chart, expectedChartNames = ["Line Graph", "Bar Chart", "Pie Chart",
			"Scatterplot", "Dot Map", "Boolean", "Line and Bar Chart"];

		catalogRequester.getCharts(function (err, charts) {
			assert(!err);
			assert(charts.length >= expectedChartNames.length)
			for (var i in charts) {
				chart = charts[i];
				assert(expectedChartNames.find(function (name) {
					return name === chart.name;
				}));
				assert(Array.isArray(chart.functions));
				assert(Array.isArray(chart.whenGroupedFunctions));
			}
			done();
		});
	});

	it("should get all charts rated", function (done) {
		var ratedchart, expectedChartNames = ["Line Graph", "Bar Chart",
			"Pie Chart", "Scatterplot", "Dot Map", "Boolean", "Line and Bar Chart"];

		catalogRequester.getRatedCharts([], false, function (err, ratedcharts) {
			assert(!err);
			assert(ratedcharts.length >= expectedChartNames.length)
			for (var i in ratedcharts) {
				ratedchart = ratedcharts[i];
				assert(expectedChartNames.find(function (name) {
					return name === ratedchart.chart;
				}));
				assert(ratedchart.rating);
			}
			done();
		});
	});
});
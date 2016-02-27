/**
 * @author Marc Karassev
 *
 * Module responsible for requesting the visualization catalog mock.
 */

var http = require("http"),
	logger = require("./logger"),
	CATALOG_HOST = "http://localhost:8085",
	FUNCTIONS_PATH = "/functions",
	CHARTS_PATH = "/charts",
	RATED_CHARTS_PATH = "/ratedcharts";

function getCatalogResource(url, callback) {
	http.get(url, function (res) {
		var data = "";

		res.on("data", function (chunk) {
			data += chunk;
		});
		res.on("end", function() {
			logger.debug(data);
			callback(null, data);
		});
	}).on("error", function (error) {
		logger.error(error);
		error.whileReachingCatalog = true;
		callback(error, null);
	});
}

function getVisualizationFunctions(callback) {
	getCatalogResource(CATALOG_HOST + FUNCTIONS_PATH, callback);
}

function getCharts(callback) {
	getCatalogResource(CATALOG_HOST + CHARTS_PATH, callback);
}

function getRatedCharts(functions, grouped, callback) {
	getCatalogResource(CATALOG_HOST + CHARTS_PATH + "?grouped=" + grouped +
		"&functions=" + functions.join("-"), callback);
}

// Exports

exports.getVisualizationFunctions = getVisualizationFunctions;
exports.getCharts = getCharts;
exports.getRatedCharts = getRatedCharts;
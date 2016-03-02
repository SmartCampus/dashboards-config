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

/**
 * Sends a GET request of the given URL.
 * 
 * @param  {string}   url      the URL to send a request to
 * @param  {Function} callback the function to call with error and data arguments
 */
function getCatalogResource(url, callback) {
	http.get(url, function (res) {
		var data = "";

		res.on("data", function (chunk) {
			data += chunk;
		});
		res.on("end", function() {
			logger.debug("catalog response:", data);
			callback(null, JSON.parse(data));
		});
	}).on("error", function (error) {
		logger.error(error);
		error.whileReachingCatalog = true;
		callback(error, null);
	});
}

/**
 * Gets visualization functions from the visualization catalog.
 * 
 * @param  {Function} callback the function to call with error and data arguments
 */
function getVisualizationFunctions(callback) {
	getCatalogResource(CATALOG_HOST + FUNCTIONS_PATH, callback);
}

/**
 * Gets charts from the visualization catalog.
 * 
 * @param  {Function} callback the function to call with error and data arguments
 */
function getCharts(callback) {
	getCatalogResource(CATALOG_HOST + CHARTS_PATH, callback);
}

/**
 * Requests the visualization catalog for rated charts according to given requirements.
 * 
 * @param  {Array}   functions 	an array of strings representing required visualization
 *                             		functions
 * @param  {Boolean}   grouped 	whether the catalog has to consider the given functions
 *                               	as grouped functions or not
 * @param  {Function} callback the function to call with error and data arguments
 */
function getRatedCharts(functions, grouped, callback) {
	getCatalogResource(CATALOG_HOST + RATED_CHARTS_PATH + "?grouped=" + grouped
		+ "&functions=" + functions.join("-"), callback);
}

// Exports

exports.getVisualizationFunctions = getVisualizationFunctions;
exports.getCharts = getCharts;
exports.getRatedCharts = getRatedCharts;
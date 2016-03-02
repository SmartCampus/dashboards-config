/**
 * @author 	Marc Karassev
 *
 * Module defining routes for the composition engine service.
 */

var router = require("express").Router(),
	catalog = require("./catalog"),
    logger = require("./logger");

/**
 * Handles GET requests on /functions path. Returns the catalog's list of
 * visualization functions.
 * 
 * @return [string] 	An array of strings representing visualization functions.
 */
router.get("/functions", function (req, res) {
	res.send(catalog.FUNCTIONS.ALL);
});

/**
 * Handles GET requests on /charts path. Returns the catalog's list of charts.
 * A chart object is defined by a name and associated visualization functions.
 * The functions property represents functions related to a chart when a single 
 * data source is applied to it.
 * The whenGroupedFunctions property represents functions related to this chart
 * when several data sources are applied to it.
 * 
 * @return [chart object] 	An array of chart objects. Chart objects look like
 *                         		this way:
 *                         			{
 *                         				"name": "Line Graph",
 *                         				"functions": ["Patterns", ...],
 *                         				"whenGroupedFunctions": ["Comparisons", ...]
 *                         			}
 */
router.get("/charts", function (req, res) {
	res.send(catalog.CHARTS.ALL.map(function (chart) {
		return chart.toJson();
	}));
});

/**
 * Handles GET requests on /ratedcharts path. Returns matching charts according
 * to given requirements. Expects "grouped" and "functions" query parameters.
 * Example: GET /ratedcharts?grouped=true&functions=Comparisons-Proportions
 *
 * @param  boolean 	grouped 	whether the chart has to handle multiple data
 *                           		sources or not	
 * @param  string 	functions 	a list of visualisation functions where function
 *                            		identifiers are delimited by a '-' character
 * @return [object]				an array of charts sorted from the most matching
 *                        			to the less one according to a rating
 *                        			criteria, ex:
 *                        				[
 *                        					{
 *                        						"name": "Line Graph",
 *                        						"rating": 4
 *                        					},
 *                        					{
 *                        						"name": "Dot Map",
 *                        						"rating": 5
 *                        					}
 *                        					...
 *                        				]
 */
router.get("/ratedcharts", function (req, res) {
	var grouped = req.query.grouped, functions = req.query.functions.split(/-/);

	logger.debug(grouped);
	logger.debug(functions);
	res.send(catalog.getChartsMatchingRequirements(functions, grouped === "true"));
});

// Exports

module.exports = exports = router;
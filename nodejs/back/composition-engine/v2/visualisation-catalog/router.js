/**
 * @author 	Marc Karassev
 *
 * Module defining routes for the composition engine service.
 */

var router = require("express").Router(),
	catalog = require("./catalog"),
    logger = require("./logger");
/**
 * Handles GET requests on /charts path. Returns matching charts according to
 * given requirements. Expects "grouped" and "functions" query parameters.
 * Example: GET /charts?grouped=true&functions=Comparisons-Proportions
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
router.get("/charts", function (req, res) {
	var grouped = req.query.grouped, functions = req.query.functions.split(/-/);

	logger.debug(grouped);
	logger.debug(functions);
	res.send(catalog.getChartsMatchingRequirements(functions, grouped));
});

// Exports

module.exports = exports = router;
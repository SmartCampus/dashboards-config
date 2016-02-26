/**
 * @author 	Marc Karassev
 *
 * Module defining routes for the composition engine service.
 */

var router = require("express").Router(),
	catalog = require("./catalog"),
    logger = require("./logger");
/**
 * // TODO
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {	var        grouped [description]
 * @return {[type]}      [description]
 */
router.post("/functions", function (req, res) {
	var grouped = req.query.grouped, functions = req.query.functions.split(/-/);

	logger.debug(grouped);
	logger.debug(functions);
	res.send(catalog.getChartsMatchingRequirements(functions, grouped));
});

// Exports

module.exports = exports = router;
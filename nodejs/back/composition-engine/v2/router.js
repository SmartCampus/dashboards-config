/**
 * @author 	Marc Karassev
 *
 * Module defining routes for the composition engine service.
 */

var router = require("express").Router(),
    logger = require("./logger");

/**
 * Handles POST requests on /composition_data path. Returns generation
 * possibilities according to given composition data.
 *
 * Composition data is composed by a set of visualization needs and a set of
 * sensors objects.
 *
 * Generation possibilities is an object containing a set of compatible
 * visualization needs, a set of compatible sensors and another set of
 * compatible widgets. When no matching widget can be found, all those sets are
 * returned empty.
 *
 * Sensor objects are defined by the sensor containers API.
 *
 * Can set 400 HTTP status code in case of bad formatted input data.
 * 
 * @param  	{
 * 				"needs": 	[string, ...],
 * 				"sensors": 	[{sensor object}, ...]
 * 			}
 * @return 	{
 * 				"needs": 	[string, ...], 
 * 				"sensors": 	[{sensor object}, ...],
 * 				"widgets": 	[string, ...]
 * 			}
 */
router.post("/composition_data", function (req, res) {
	res.status(501).end();
});

// Exports

module.exports = exports = router;
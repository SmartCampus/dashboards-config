/**
 * @author 	Marc Karassev
 *
 * Module defining routes for the composition engine service.
 */

var router = require("express").Router(),
	engine = require("./engine"),
    logger = require("./logger");

/**
 * Handles POST requests on /composition_data path. Returns generation
 * possibilities according to given composition data.
 *
 * Composition data is composed by a set of visualization needs and a set of
 * sensors objects.
 *
 * Generation possibilities is an object containing a set of compatible
 * visualization needs, a boolean pointing out if other data sources can be
 * added and a set of compatible widgets. When no matching widget can be found,
 * the sets are returned empty.
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
 * 				"acceptMoreSensors": boolean,
 * 				"widgets": 	[string, ...]
 * 			}
 */
router.post("/composition_data", function (req, res) {
	var needs = req.body.needs, sensors = req.body.sensors;

	if (!checkCompositionData(needs, sensors)) {
		res.status(400).send({ "invalidJson": true });
	}
	else {
		// for web browsers that send undefined instead of an empty array
		if (!sensors) {
			sensors = [];
		}
		engine.compose(needs, sensors, function (err, result) {
			if (err) {
				logger.warn(err);
				res.status(500).send(err);
			}
			else {
				res.status(200).send({
					needs: result.needs,
					acceptMoreSensors: result.acceptMoreSensors,
					widgets: result.widgets.map(function (ratedwidget) {
						return ratedwidget.widget;
					})
				});
			}
		});
	}
});

/**
 * Checks if the JSON send containing composition data is correct.
 * 
 * @param  Array 	needs   the "needs" JSON property that should be an array
 *                        		of strings
 * @param  Array 	sensors the "sensors" JSON property that should be an array
 * @return Boolean     	    true if the data is correct, false otherwise
 */
function checkCompositionData(needs, sensors) {
	if (!Array.isArray(needs) || (sensors && !Array.isArray(sensors))) {
		return false;
	}
	for (var i in needs) {
		if (!engine.needExists(needs[i])) {
			return false;
		}
	}
	return true;
}

/**
 * Initialization function, calls the composition engine to initialize.
 * 
 * @param  {Function} 	callback 	the callback to call with an optional error
 */
router.init = function init(callback) {
	engine.init(function (err) {
		if (err) {
			logger.error(err);
			callback(err);
		}
		else {
			logger.info("composition router initialized");
			callback(null);
		}
	});
}

// Exports

module.exports = exports = router;
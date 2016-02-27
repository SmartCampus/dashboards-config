/**
 * @author Marc Karassev
 *
 * Module handling the needs, widgets and sensors composition logic.
 */

var catalogRequester = require("./visualization_catalog_requester"),
	async = require("async"),
	logger = require("./logger");

var NEEDS, WIDGETS;

// has to restrict needs in order to absolutely match a chart

function getNeeds() {
	return NEEDS;
}

function getWidgets() {
	return WIDGETS;
}

function init(callback) {
	async.parallel([
		function (cb) {
			catalogRequester.getVisualizationFunctions(function (err, functions) {
				if (err) {
					logger.warn(err);
					cb(err);
				}
				else {
					NEEDS = functions;
					cb(null);
				}
			});
		},
		function (cb) {
			catalogRequester.getCharts(function (err, charts) {
				if (err) {
					logger.warn(err);
					cb(err);
				}
				else {
					WIDGETS = charts;
					cb(null);
				}
			});
		}
	], function join (err, results) {
		if (err) {
			logger.error(err);
			callback(err);
		}
		else {
			logger.info("composition engine initialized");
			callback(null);
		}
	});
}

// Exports

exports.getNeeds = getNeeds;
exports.getWidgets = getWidgets;
exports.init = init;
/**
 * @author Marc Karassev
 *
 * Module handling the needs, widgets and sensors composition logic.
 * Visualization needs and widgets are defined in the visualization catalog mock.
 */

"use strict";

var catalogRequester = require("./visualization_catalog_requester"),
	async = require("async"),
	logger = require("./logger");

var NEEDS, WIDGETS;

/**
 * Compose the given inputs in order to return composition possibilities.
 * 
 * Composition possibilities describes compatible needs and widgets alongside
 * a boolean defining whether input sources can still be added in relation with
 * the input data.
 * 
 * Restricts outputted needs in order to absolutely march a chart.
 * 
 * Widgets are returned with their name and a rating value tha classifies them
 * from the most matching to the less one, ex:
 * 	[
 * 		{
 * 			"widget": "line",
 * 	  		"rating": 1
 * 	    },
 * 		{
 * 			"widget": "bar",
 * 	  		"rating": 2
 * 	    }
 *  ]
 *
 * The lesser the rating value is, the most the widget matches the requirements.
 * Also its name matches stricly a Generator service template name.
 * 
 * @param  {Array}		needs  		an array of string representing visualization
 *                           			needs
 * @param  {Array}   	sensors  	an array of sensors objects as defined in the
 *                              		sensor container API, actually only the
 *                              		array length matters
 * @param  {Function} 	callback 	the callback to call with error and result
 *                               		parameters, the result looks like this:
 *                               			{
 *                               				"needs": {Array},
 *                               				"acceptMoreSensors": {Boolean},
 *                               				"widgets": {Array}
 *                               			}
 */
function compose(needs, sensors, callback) {
	var grouped = sensors.length > 1, compatibleWidgets = [], acceptMoreSensors;

	catalogRequester.getRatedCharts(needs, grouped, function (err, ratedcharts) {
		if (err) {
			logger.warn(err);
			callback(err, null);
		}
		else {
			compatibleWidgets = ratedcharts.map(function (ratedchart) {
				return {
					widget: adaptWidgetName(ratedchart.chart),
					rating: ratedchart.rating
				};
			});
			if (grouped || widgetContainingGroupedNeedsExists(needs)
				|| sensors.length === 0) {
				acceptMoreSensors = true;
			}
			else {
				acceptMoreSensors = false;
			}
			callback(null, {
				needs: Array.from(findCompatibleNeeds(needs, grouped)),
				acceptMoreSensors: acceptMoreSensors,
				widgets: compatibleWidgets
			});
		}
	});
}

/**
 * Returns whether a widget matching the given needs as grouped needs does exist.
 * 
 * @param  {Array} 		needs 	a string array representing visualization needs
 * @return {Boolean}       		true if such a widget exists, false otherwise
 */
function widgetContainingGroupedNeedsExists(needs) {
	for (var i in WIDGETS) {
		if (widgetContainsNeeds(WIDGETS[i], needs, true)) {
			return true;
		}
	}
	return false;
}

/**
 * Searches the widgets in order to find compatible needs to a given need set.
 * 
 * @param  {Array} 		needs 	a string array representing visualization needs
 * @param  {Boolean} 	grouped whether the algorythm has to look for grouped
 *                            		needs only or not
 * @return {Set}         		a set of strings representing compatible
 *                           		visualization needs
 */
function findCompatibleNeeds(needs, grouped) {
	var widget, functions = [], compatibleNeeds = new Set();

	for (var i in WIDGETS) {
		widget = WIDGETS[i];
		if (!grouped && widgetContainsNeeds(widget, needs, false)) {
			functions = functions.concat(widget.functions);
		}
		if (widgetContainsNeeds(widget, needs, true)) {
			functions = functions.concat(widget.whenGroupedFunctions);
		}
	}
	functions.forEach(function (f) {
		if (needs.indexOf(f) === -1) {
			compatibleNeeds.add(f);
		}
	});
	return compatibleNeeds;
}

/**
 * Returns whether the given widget contains the given needs.
 * 
 * @param  {Widget} 	widget  the widget to inspect
 * @param  {Array} 		needs   the visualizaiton needs to look for
 * @param  {Boolean} 	grouped whether the algorythm has to loof for grouped
 *                            		visualization needs or not
 * @return {Boolean}         	true if the widget contains such needs, false
 *                                 otherwise
 */
function widgetContainsNeeds(widget, needs, grouped) {
	var containedNeeds = grouped ? widget.whenGroupedFunctions : widget.functions;

	for (var i in needs) {
		if (!containedNeeds.find(function (containedNeed) {
			return containedNeed === needs[i];
		})) {
			return false;
		}
	}
	return true;
}

/**
 * Gets a widget by its name.
 * 
 * @param  {string} widgetName the name to look for
 * @return {Widget}            the matching widget object
 */
function getWidgetByName(widgetName) {
	return WIDGETS.find(function (widget) {
		return widget.name === widgetName;
	});
}

/**
 * Adapts a widget name in order to make it match a template from the Generation
 * service.
 * 
 * @param  {string} widgetName the widget name to adapt
 * @return {string}            the adapted name, undefined if could not adapt it
 */
function adaptWidgetName(widgetName) {
	switch(widgetName.toLowerCase()) {
		case "line graph": return "line";
		case "bar chart": return "column";
		case "pie chart": return "pieChart";
		case "scatterplot": return "scatterplot";
		case "dot map": return "map";
		case "boolean": return "boolean";
		case "line and bar chart": return "mix";
		default: return undefined;
	}
}

/**
 * Returns whether a given visualization need does exist or not.
 * 
 * @param  {string} 	need 	the need to look for
 * @return {Boolean}      		true if exists, false otherwise
 */
function needExists(need) {
	return NEEDS.find(function (element) {
		return need.toLowerCase() === element.toLowerCase();
	}) ? true : false;
}

/**
 * Gets all the visualization needs.
 * 
 * @return {Array} an array of string representing visualization needs
 */
function getNeeds() {
	return NEEDS;
}

/**
 * Gets all the widgets.
 * 
 * @return {Widget} an array of widget objects has defined in the visualization
 *                     catalog
 */
function getWidgets() {
	return WIDGETS;
}

/**
 * Initializes the composition engine, gets the visualization needs and widgets
 * from the visualization catalog.
 * 
 * @param  {Function} callback the callback to call with an optional error
 */
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
					WIDGETS.map(function (widget) {
						widget.name = adaptWidgetName(widget.name);
						return widget;
					});
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

exports.compose = compose;
exports.needExists = needExists;
exports.getNeeds = getNeeds;
exports.getWidgets = getWidgets;
exports.init = init;
/**
 * @author Marc Karassev
 *
 * Module handling the needs, widgets and sensors composition logic.
 */

"use strict";

var catalogRequester = require("./visualization_catalog_requester"),
	async = require("async"),
	logger = require("./logger");

var NEEDS, WIDGETS;

// has to restrict needs in order to absolutely match a chart
function compose(needs, sensors, callback) {
	var grouped = sensors.length > 1, compatibleWidgets = [];

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
			callback(null, {
				needs: Array.from(findCompatibleNeeds(needs, grouped)),
				widgets: compatibleWidgets
			});
		}
	});
}

function findCompatibleNeeds(needs, grouped) {
	var widget, functions, compatibleNeeds = new Set();

	for (var i in WIDGETS) {
		widget = WIDGETS[i];
		if (widgetContainsNeeds(widget, needs, grouped)) {
			functions = grouped ? widget.whenGroupedFunctions : widget.functions; 
			functions.forEach(function (f) {
				if (needs.indexOf(f) === -1) {
					compatibleNeeds.add(f);
				}
			});
		}
	}
	return compatibleNeeds;
}

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

function getWidgetByName(widgetName) {
	return WIDGETS.find(function (widget) {
		return widget.name === widgetName;
	});
}

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

function needExists(need) {
	return NEEDS.find(function (element) {
		return need.toLowerCase() === element.toLowerCase();
	}) ? true : false;
}

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
/**
 * @author Marc Karassev
 *
 * Module defining charts and visualization functions relations.
 */

"use strict";

var logger = require("./logger");

// Visualization functions

var PATTERNS = "Patterns",
	DATA_OVER_TIME = "Data over time",
	COMPARISONS = "Comparisons",
	RELATIONSHIPS = "Relationships",
	DISTRIBUTION = "Distribution",
	PART_TO_A_WHOLE = "Part to a whole",
	PROPORTIONS = "Proportions",
	LOCATION = "Location",
	STATE = "State";	// custom

var FUNCTIONS = {
	PATTERNS: PATTERNS,
	DATA_OVER_TIME: DATA_OVER_TIME,
	COMPARISONS: COMPARISONS,
	RELATIONSHIPS: RELATIONSHIPS,
	DISTRIBUTION: DISTRIBUTION,
	PART_TO_A_WHOLE: PART_TO_A_WHOLE,
	LOCATION: LOCATION,
	STATE: STATE,
	ALL: [PATTERNS, DATA_OVER_TIME, COMPARISONS, RELATIONSHIPS, DISTRIBUTION,
		PART_TO_A_WHOLE, PROPORTIONS, LOCATION, STATE]
}

// Charts

/**
 * Chart class, represents a chart, has a name and associated functions.
 *
 * @attribute name 					chart's name
 * @attribute functions 			represents functions related to this chart when
 * 										a single data source is applied to it.
 * @attribute whenGroupedFunctions 	represents functions related to this chart when
 * 										several data sources are applied to it.
 */
class Chart {

	constructor(name, functions, whenGroupedFunctions) {
		this._name = name;
		this._functions = functions;
		this._whenGroupedFunctions = whenGroupedFunctions;
	}

	get name() { return this._name; }
	get functions() { return this._functions; }
	get whenGroupedFunctions() { return this._whenGroupedFunctions; }

	toJson() {
		return {
			name: this._name,
			functions: this._functions,
			whenGroupedFunctions: this._whenGroupedFunctions
		};
	}
}

var LINE_GRAPH = new Chart("Line Graph", [PATTERNS, DATA_OVER_TIME],
		[PATTERNS, DATA_OVER_TIME, COMPARISONS, RELATIONSHIPS]),
	BAR_CHART = new Chart("Bar Chart", [COMPARISONS, RELATIONSHIPS, PATTERNS,
		/*DATA_OVER_TIME*/], [COMPARISONS, RELATIONSHIPS, PATTERNS, DISTRIBUTION,
		/*DATA_OVER_TIME*/]), // Added data over time
	PIE_CHART = new Chart("Pie Chart", [COMPARISONS, PART_TO_A_WHOLE, PROPORTIONS], []),
	SCATTERPLOT = new Chart("Scatterplot", [PATTERNS, RELATIONSHIPS, /*DATA_OVER_TIME*/],
		[]), // Added Data over time
	DOT_MAP = new Chart("Dot Map", [], [DISTRIBUTION, LOCATION, PATTERNS]),
	BOOLEAN = new Chart("Boolean", [STATE], []), // Custom
	LINE_BAR_CHART = new Chart("Line and Bar Chart", [], [COMPARISONS, DATA_OVER_TIME,
		RELATIONSHIPS, PATTERNS, DISTRIBUTION]); // Custom

var CHARTS = {
	LINE_GRAPH: LINE_GRAPH,
	BAR_CHART: BAR_CHART,
	PIE_CHART: PIE_CHART,
	SCATTERPLOT: SCATTERPLOT,
	DOT_MAP: DOT_MAP,
	BOOLEAN: BOOLEAN,
	LINE_BAR_CHART: LINE_BAR_CHART,
	ALL: [LINE_GRAPH, BAR_CHART, PIE_CHART, SCATTERPLOT, DOT_MAP, BOOLEAN, 
		LINE_BAR_CHART]
}

// Functions

/**
 * Returns matching charts according to given requirements.
 * The result is an array of charts sorted from the most matching to the less one
 * according to a rating criteria, ex:
 * 	 [
 *  	 {
 *   		"name": "Line Graph",
 *     		"rating": 4
 *       },
 *       {
 *       	"name": "Dot Map",
 *        	"rating": 5
 *       }
 *       ...
 *   ]
 * 
 * @param  {Array}   	requiredFunctions 	a list of required visualization functions
 * @param  {Boolean} 	grouped           	whether the charts have to handle multiple
 *                                       		data sources or not
 * @param  {Function} 	callback          	the callback function to call with error
 *                                        		and result parameters
 */
function getChartsMatchingRequirements(requiredFunctions, grouped, callback) {
	var chart, chartsWithRatings = [], functions;

	for (var i in CHARTS.ALL) {
		chart = CHARTS.ALL[i];
		if (grouped) {
			functions = chart.whenGroupedFunctions;
		}
		else {
			functions = chart.functions;
		}
		logger.debug(functions);
		chartsWithRatings.push({
			chart: chart.name,
			rating: matchAndRateFunctions(requiredFunctions, functions)
		});
	}
	chartsWithRatings.sort(function compare(a, b) {
		return a.rating - b.rating;
	});
	return chartsWithRatings;
}

// count the differences between requiredFunctions and functions sets
function matchAndRateFunctions(requiredFunctions, functions) {
	var differences = 0;

	if (functions.length == 0) {
		return FUNCTIONS.ALL.length + 1;
	}
	for (var i in requiredFunctions) {
		if (!functions.find(function (element) {
			return element.toLowerCase() === requiredFunctions[i].toLowerCase();
		})) {
			differences++;
		}
	}
	for (var i in functions) {
		if (!requiredFunctions.find(function (element) {
			return element.toLowerCase() === functions[i].toLowerCase();
		})) {
			differences++;
		}
	}
	return differences;
}

// Exports

exports.getChartsMatchingRequirements = getChartsMatchingRequirements;
exports.FUNCTIONS = FUNCTIONS;
exports.CHARTS = CHARTS;
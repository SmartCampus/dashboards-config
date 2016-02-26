/**
 * @author 	Marc Karassev
 *
 * Module defining charts and visualization functions relations.
 *
 */

"use strict";

var logger = require("./logger");

// Visualization functions

var PATTERNS = "Patterns",
	DATA_OVER_TIME = "Data over time",
	COMPARISONS = "Comparisons",
	RELATIONSHIPS = "Relationships",
	DISTRIBUTION = "Distribution",
	PART_TO_A_WHOLE = "Part-to-a-whole",
	PROPORTIONS = "Proportions",
	LOCATION = "Location",
	STATUS = "Status";	// custom

var FUNCTIONS = {
	PATTERNS: PATTERNS,
	DATA_OVER_TIME: DATA_OVER_TIME,
	COMPARISONS: COMPARISONS,
	RELATIONSHIPS: RELATIONSHIPS,
	DISTRIBUTION: DISTRIBUTION,
	PART_TO_A_WHOLE: PART_TO_A_WHOLE,
	LOCATION: LOCATION,
	STATUS: STATUS,
	ALL: [PATTERNS, DATA_OVER_TIME, COMPARISONS, RELATIONSHIPS, DISTRIBUTION,
		PART_TO_A_WHOLE, PROPORTIONS, LOCATION, STATUS]
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
	BOOLEAN = new Chart("Boolean", [STATUS], []), // Custom
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
			return element === requiredFunctions[i];
		})) {
			differences++;
		}
	}
	for (var i in functions) {
		if (!requiredFunctions.find(function (element) {
			return element === functions[i];
		})) {
			differences++;
		}
	}
	return differences;
}

// Exports

exports.getChartsMatchingRequirements = getChartsMatchingRequirements;
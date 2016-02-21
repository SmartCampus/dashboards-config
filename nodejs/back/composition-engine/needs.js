/**
 * @author Marc Karassev
 *
 * This module defines domain concepts such as the different sensor categories and needs that
 * can be expressed by a user. It encapsulates the complexity of matching sensors to needs
 * and needs to sensors.
 */

"use strict";

var async = require("async"),
	logger = require("./logger"),
	requestSmartcampus = require("./request_smartcampus");

// Sensor categories
// TODO get it from the sensor container API?

var TEMP = "TEMP",
	LIGHT = "LIGHT",
	ENERGY = "ENERGY",
	NUMBER = "NUMBER",
	SOUND = "SOUND";

var SENSOR_CATEGORIES = {
	TEMP: TEMP,
	LIGHT: LIGHT,
	ENERGY: ENERGY,
	NUMBER: NUMBER,
	SOUND: SOUND
}

/**
 * Visualization needs, a need has three properties. It has a name that should be unique,
 * a set of compatible sensor categories and a set of compatible needs.
 */
class Need {
	
	constructor (name, sensorCategories) {
		this._name = name;
		this._sensorCategories = sensorCategories;
	}

	get name() { return this._name; }

	get sensorCategories() { return this._sensorCategories; }

	get compatibleNeeds() { return this._compatibileNeeds; }
	set compatibleNeeds(compatibleNeeds) { this._compatibileNeeds = compatibleNeeds; }
}

// Needs and NEEDS namespace initialization

var COMPARISON = new Need("Comparison", [TEMP, LIGHT, ENERGY, NUMBER, SOUND]),
	SEE_STATUS = new Need("See status", [NUMBER]),
	OVERTIME = new Need("Overtime", [TEMP, LIGHT, ENERGY, NUMBER, SOUND]),
	RELATIONSHIPS = new Need("Relationships", [SOUND, NUMBER]),
	HIERARCHY = new Need("Hierarchy", []),
	PROPORTION = new Need("Proportion", [TEMP, LIGHT, ENERGY, NUMBER, SOUND]),
	SUMMARIZE = new Need("Summarize", []),
	PATTERN = new Need("Pattern", [NUMBER]);

COMPARISON.compatibleNeeds = [OVERTIME, PROPORTION, RELATIONSHIPS];
SEE_STATUS.compatibleNeeds = [];
OVERTIME.compatibleNeeds = [COMPARISON, PROPORTION, RELATIONSHIPS, PATTERN];
RELATIONSHIPS.compatibleNeeds = [COMPARISON, OVERTIME];
HIERARCHY.compatibleNeeds = [];
PROPORTION.compatibleNeeds = [COMPARISON, OVERTIME];
SUMMARIZE.compatibleNeeds = [],
PATTERN.compatibleNeeds = [OVERTIME];

var NEEDS = {
	COMPARISON: COMPARISON,
	SEE_STATUS: SEE_STATUS,
	OVERTIME: OVERTIME,
	RELATIONSHIPS: RELATIONSHIPS,
	HIERARCHY: HIERARCHY,
	PROPORTION: PROPORTION,
	SUMMARIZE: SUMMARIZE,
	PATTERN: PATTERN
}

/**
 * Utility function that looks up the NEEDS namespace in order to find need instances.
 * 
 * @param  [string] needStrings 	string array containing the needs name to look for
 * @return [Need]					an array containing the matched Need class instances
 */
function getNeedsByName(needStrings) {
	var needs = [];

	for (var need in NEEDS) {
		if (needStrings.find(function (str) {
			return str == NEEDS[need].name;
		})) {
			needs.push(NEEDS[need]);
		}
	}
	return needs;
}

/**
 * Gets the whole compatible sensors with the given need array.
 * 
 * @param  [Need]		needs 		the array of needs in relation with the sensors 
 * 									have to be retrieved
 * @param  Function 	callback	the callback to call with err dans results parameters
 * 									if no error, results is a sensor objects array
 */
function getSensorsMatchingNeeds(needs, callback) {
	var sensors = [], sensorCategories;

	if (!checkNeedsConsistency(needs)) {
		var err = new Error("unconsistent need set");

		err.unconsistentNeedSet = true;
		callback(err, null);
	}
	else {
		sensorCategories = intersectCategories(needs);
		logger.debug("categories:", sensorCategories);
		async.map(sensorCategories, function (category, callback) {
			requestSmartcampus.getSensorsByCategory(category, function (err, results) {
				if (err) {
					logger.warn("error while getting sensors from category " + category);
					callback(err, null);
				}
				else {
					callback(null, {set: category, sensors: JSON.parse(results)});
				}
			});
		}, function (err, results) {
			if (err) {
				logger.error("error while getting sensors from categories");
				callback(err, null);
			}
			else {
				callback(null, results);
			}
		});
	}
}

/**
 * Intersects the categories contained by the given need array.
 * complexity: O(n²)
 * 
 * @param  [Need]	needs 	the array containing the needs containing the categories
 * 							to intersect
 * @return [string]			an array of resulting categories
 */
function intersectCategories(needs) {
	var categories = [], need, category;

	for (var i = needs.length - 1; i >= 0; i--) {
		need = needs[i];
		for (var j = need.sensorCategories.length - 1; j >= 0; j--) {
			category = need.sensorCategories[j];
			if (categories.indexOf(category) == -1 && needsContainsCategory(needs, category)) {
				categories.push(category);
			}
		}
	}
	return categories;
}

/**
 * Tests if all the needs in the given array have the given category in their categories.
 * complexity: O(n)
 * 
 * @param  [Need]	needs 		the need array to check
 * @param  string 	category 	the category to look for
 * @return boolean				true if the category is contained by all needs,
 * 								fale otherwise
 */
function needsContainsCategory(needs, category) {
	for (var i in needs) {
		if (!needs[i].sensorCategories.find(function predicate(element) {
			return element === category;
		})) {
			return false;
		}
	}
	return true;
}

/**
 * Tests whether a need set is consistent meaning that all needs contained by the given
 * set are compatible with each other.
 * 
 * @param  [Need]	needs 	an array of needs to check mutual compatibility
 * @return boolean       	true if all the given needs are compatible among each other,
 *                          false otherwise
 */
function checkNeedsConsistency(needs) {
	var need;

	for (var i = needs.length - 1; i >= 0; i--) {
		need = needs[i];
		for (var j = needs.length - 1; j >= 0; j--) {
			if (j != i && needs[j].compatibleNeeds.findIndex(function (element, index, tab) {
				if (element.name === need.name) return true;
				else return false;
			}) == -1) {
				return false;
			}
		}
	}
	return true;
}

/**
 * Gets the whole compatible needs with the given sensor array.
 * 
 * @param  [JSON]		sensor 		the array of sensors in relation with the related needs 
 * 									have to be retrieved, a sensor should at least have a
 * 									"category" property with a value matching one of those
 * 									defined above
 * @param  Function 	callback	the callback to call with err dans results parameters
 * 									if no error, results is a need objects array
 */
function getNeedsMatchingSensors(sensors, callback) {
	callback(null, mergeNeedsFromCategories(getCategoriesFromSensors(sensors)));
}

/**
 * Tests strictly (===) if the given element is contained in the given array.
 * 
 * @param  Array 	array	the array to look up
 * @param  			element the element to look for
 * @return boolean 			true if the element is contained in the array,
 * 							false otherwise
 */
function findElementInArray(array, element) {
	return array.find(function (el) {
		return el === element;
	});
}

/**
 * Tests strictly (===) if the given categories are all contained in the given array.
 * 
 * @param  Array 	array     	the array to look up
 * @param  [string] categories 	the categories array containing the sensor categories
 *                              to look for
 * @return boolean            	true if all the categories are contained in the array,
 *                              false otherwise
 */
function findCategoriesInArray(array, categories) {
	for (var i = categories.length - 1; i >= 0; i--) {
		if (!findElementInArray(array, categories[i])) {
			return false;
		}
	};
	return true;
}

/**
 * Finds all needs that are compatible with all the given categories.
 * 
 * @param  [string]	categories 	the categories array containing the sensor categories
 *                              to look for
 * @return [Need]	            an array of matching Need class instances
 */
function mergeNeedsFromCategories(categories) {
	var needs = [], need;

	for (var property in NEEDS) {
		need = NEEDS[property];
		if (!findElementInArray(needs, need)) {
			if (findCategoriesInArray(need.sensorCategories, categories)) {
				needs.push(need);
			}
		}
	}
	return needs;
}

/**
 * Gets all the categories of the given sensors.
 * 
 * @param  [JSON]	sensors 	the array of sensors in relation with the related categories 
 * 									have to be extracted, a sensor should at least have a
 * 									"category" property with a value matching one of those
 * 									defined above
 * @return [string]				an array of sensor categories as defined above
 */
function getCategoriesFromSensors(sensors) {
	var sensor, categories = [], category;

	for (var i = sensors.length - 1; i >= 0; i--) {
		category = sensors[i].category;
		// TODO: quick fix pour que categories & unit arrêtent de poser pb
		// category = sensors[i].unit;
		// if (category === "temperature") {
		// 	category = TEMP;
		// } else if (category === "watt") {
		// 	category = ENERGY;
		// } else if (category === "number") {
		// 	category = NUMBER;
		// } else if (category === "lux") {
		// 	category = LIGHT;
		// }
		if (!findElementInArray(categories, category)) {
			categories.push(category);
		}
	};
	return categories;
}

// Exports

exports.SENSOR_CATEGORIES = SENSOR_CATEGORIES;
exports.NEEDS = NEEDS;
exports.getSensorsMatchingNeeds = getSensorsMatchingNeeds;
exports.getNeedsMatchingSensors = getNeedsMatchingSensors;
exports.checkNeedsConsistency = checkNeedsConsistency;
exports.getNeedsByName = getNeedsByName;
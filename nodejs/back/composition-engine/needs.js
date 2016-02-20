/**
 * @author Marc Karassev
 */

"use strict";

var async = require("async"),
	logger = require("./logger"),
	requestSmartcampus = require("./request_smartcampus");

// Sensor categories

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

// Visualization needs

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

var COMPARISON = new Need("Comparison", [TEMP, LIGHT, ENERGY, NUMBER, SOUND]),
	SEE_STATUS = new Need("See status", [NUMBER]),
	OVERTIME = new Need("Overtime", [TEMP, LIGHT, ENERGY, NUMBER, SOUND]),
	RELATIONSHIPS = new Need("Relationships", [SOUND, NUMBER]),
	HIERARCHY = new Need("Hierarchy", []),
	PROPORTION = new Need("Proportion", [TEMP, LIGHT, ENERGY, NUMBER]),
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

function getSensorsMatchingNeeds(needs, callback) {
	var sensors = [], sensorCategories;

	if (!checkNeedsConsistency(needs)) {
		var err = new Error("unconsistent need set");

		err.unconsistentNeedSet = true;
		callback(err, null);
	}
	else {
		sensorCategories = mergeCategories(needs);
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

function mergeCategories(needs) {
	var categories = [], need, category;

	for (var i = needs.length - 1; i >= 0; i--) {
		need = needs[i];
		for (var j = need.sensorCategories.length - 1; j >= 0; j--) {
			category = need.sensorCategories[j];
			if (categories.indexOf(category) == -1) {
				categories.push(category);
			}
		}
	}
	return categories;
}

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

function getNeedsMatchingSensors(sensors, callback) {
	callback(null, mergeNeedsFromCategories(getCategoriesFromSensors(sensors)));
}

function findElementInArray(array, element) {
	return array.find(function (el) {
		return el === element;
	});
}

function findCategoriesInArray(array, categories) {
	for (var i = categories.length - 1; i >= 0; i--) {
		if (!findElementInArray(array, categories[i])) {
			return false;
		}
	};
	return true;
}

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

function getCategoriesFromSensors(sensors) {
	var sensor, categories = [], category;

	for (var i = sensors.length - 1; i >= 0; i--) {
		category = sensors[i].category;
		//TODO: quick fix pour que categories & unit arrêtent de poser pb
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
/**
 * @author Marc Karassev
 */

"use strict";

var logger = require("./logger");

class Need {
	
	constructor (name) {
		this._name = name;
	}

	get name() { return this._name; }
	get compatibleNeeds() { return this._compatibileNeeds; }
	set compatibleNeeds(compatibleNeeds) { this._compatibileNeeds = compatibleNeeds; }
}

var COMPARISON = new Need("Comparison"), SEE_STATUS = new Need("See status"), OVERTIME = new Need("Overtime"),
	RELATIONSHIPS = new Need("Relationships"), HIERARCHY = new Need("Hierarchy"),
	PROPORTION = new Need("Proportion"), SUMMARIZE = new Need("Summarize");

COMPARISON.compatibleNeeds = [OVERTIME, PROPORTION];
SEE_STATUS.compatibleNeeds = [];
OVERTIME.compatibleNeeds = [COMPARISON, PROPORTION];
RELATIONSHIPS.compatibleNeeds = [];
HIERARCHY.compatibleNeeds = [];
PROPORTION.compatibleNeeds = [COMPARISON, OVERTIME];
SUMMARIZE.compatibleNeeds = [];

var NEEDS = {
	COMPARISON: COMPARISON,
	SEE_STATUS: SEE_STATUS,
	OVERTIME: OVERTIME,
	RELATIONSHIPS: RELATIONSHIPS,
	HIERARCHY: HIERARCHY,
	PROPORTION: PROPORTION,
	SUMMARIZE: SUMMARIZE
}

function getSensorsMatchingNeeds(needs, callback) {
	if (!checkNeedsConsistency(needs)) {
		var err = new Error("unconsistent need set");

		err.unconsistentNeedSet = true;
		callback(err, null);
	}
	// TODO
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
		};
	};
	return true;
}

// Exports

exports.NEEDS = NEEDS;
exports.getSensorsMatchingNeeds = getSensorsMatchingNeeds;
exports.checkNeedsConsistency = checkNeedsConsistency;
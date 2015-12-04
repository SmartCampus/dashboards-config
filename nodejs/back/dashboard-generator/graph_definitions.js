/**
 * @author Marc Karassev
 */

"use strict";

class YAxisType {

	constructor(name, minValue, maxValue, unit, plotLine, approxType) {
		this._name = name;
		this._minValue = minValue;
		this._maxValue = maxValue;
		this._unit = unit;
		this._plotLine = plotLine;
		this._approxType = approxType;
	}

	get name () { return this._name }
	get minValue () { return this._minValue }
	get maxValue () { return this._maxValue }
	get unit () { return this._unit }
	get plotLine () { return this._plotLine }
}

var PERCENT = new YAxisType("percent", 0, 100, "%", {}, "average"),
	NUMBER = new YAxisType("number", 0, undefined, undefined, {}, "sum"),
	TEMPERATURE = new YAxisType("temperature", undefined, undefined, undefined,
		{
			value: 0,
			color: "red",
			dashStyle: "shortdash",
			width: 2,
			label: {"text": "0°C"}
		},
	"average");

var YAXIS_TYPES = {
	percent: PERCENT,
	number: NUMBER,
	temperature: TEMPERATURE
};

var YAXIS_TYPES_ARRAY = [PERCENT, NUMBER, TEMPERATURE]

function getYAxisType(type) {
	for (var i in YAXIS_TYPES_ARRAY) {
		if (YAXIS_TYPES_ARRAY[i].name == type) {
			return YAXIS_TYPES_ARRAY[i];
		}
	}
	return undefined;
}

function copyYAxisTypeProperties(type, target) {
	if (type.minValue != undefined) target.minValue = type.minValue;
	else target.minValue = "undefined";
	if (type.maxValue != undefined) target.maxValue = type.maxValue;
	else target.maxValue = "undefined";
	if (type.unit) target.unit = type.unit;
	if (type.plotLine) target.plotLine = type.plotLine;
}

// TODO Graph class

// Exports

exports.YAXIS_TYPES = YAXIS_TYPES;
exports.getYAxisType = getYAxisType;
exports.copyYAxisTypeProperties = copyYAxisTypeProperties;
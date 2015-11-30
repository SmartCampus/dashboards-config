/**
 * Created by Quentin on 11/27/2015.
 */
"use strict";
var requesterSC = require("./request_smartcampus");


class SensorSet {
    constructor(name, sensors) {
        this.name = name;
        this.sensors = sensors;
    }

    getSensors() {
        return this.sensors;
    }

    getName() {
        return this.name;
    }
}

class SensorContainer extends SensorSet {

    constructor(name, filters, sensors, childContainer) {
        super(name, sensors);
        this.childContainer = childContainer;
        this.filters = filters;
    }

    getSensors() {
        for(var child in this.childContainer) {
            sensors.push(child.getSensors());
        }
    };

    addFilter(filter) {
        this.filters.push(filter);
    };
}


/**
 * This class represent
 */
class SensorCategory extends SensorSet {
    constructor(name, sensors) {
        super(name, sensors);
    }
}

var smartCampus = [];
var categories = [];
var containers = [];

/**
 *
 */
function initSystem() {
    requesterSC.getAllSensors(function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end", function() {
            initSensors(stringData)
        });
    });
}

/**
 *
 *
 * @param data
 *
 * TODO : Capteur TEMP_444V pas dans la liste car /sensors le renvoie cependant il est la.
 */
function initSensors(data) {
    initCategories();
    initContainers();

    var json = JSON.parse(data);
    var jsonContainers = json._items;
    for(var i in jsonContainers) {
        for(var iterator in categories) {
            var filter = new RegExp("(?:^|[^A-Za-z])" + categories[iterator].getName() + "(?:[^A-Za-z]|$)", "ig");
            if(filter.test(jsonContainers[i].name)) {
                categories[iterator].getSensors().push(jsonContainers[i].name);
            }
        }
    }
    console.log(categories);
}

/**
 *
 * This function init the different categories of sensors, which means the temperature, the doors,
 * the windows and the air conditioning.
 *
 */
function initCategories() {
    var temperatureSensors = new SensorCategory("TEMP", []);
    var doorSensors = new SensorCategory("DOOR", []);
    var airConditioningSensors = new SensorCategory("AC", []);
    var windowSensors = new SensorCategory("WINDOW", []);

    categories.push(temperatureSensors);
    categories.push(doorSensors);
    categories.push(airConditioningSensors);
    categories.push(windowSensors);

}

function initContainers() {
    var campus = new SensorContainer("Campus SophiaTech", ["CAMPUS"], [], []);
    var templierWest = new SensorContainer("Templiers Ouest", [], [], []);
    var fouthFloor = new SensorContainer("4th floor", ["SPARKS"] ,[], []);
    var coffeeCorner = new SensorContainer("Coffee corner", ["COFFEE", "CAFE"], [], []);
    var sousRepartiteur = new SensorContainer("Sous repartiteur", ["MW_power"] , [], []);
    var modalisCorridor = new SensorContainer("Modalis corridor", ["Modalis", "CORRIDOR"], [], []);
    var office443 = new SensorContainer("Office 443", [], []);
    var offce444 = new SensorContainer("Office 444", [], []);
    // TODO : coffee corner

}




exports.SensorContainer = SensorContainer;
exports.SensorSet = SensorSet;
exports.SensorCategory = SensorCategory;
exports.initSystem = initSystem;
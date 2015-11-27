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

    constructor(name, sensors, childContainer) {
        super(name, sensors);
        this.childContainer = childContainer;
    }

    getSensors() {
        for(var child in this.childContainer) {
            sensors.push(child.getSensors());
        }
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
            initContainers(stringData)
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
function initContainers(data) {
    initCategories();

    var json = JSON.parse(data);
    var jsonContainers = json._items;
    for(var i in jsonContainers) {
        if(jsonContainers[i].sensorType == "virtual_filter") {
            for(var iterator in categories) {
             //   console.log(categories[iterator].getName());
                var filter = new RegExp(categories[iterator].getName(), "i");
                if(filter.test(jsonContainers[i].name)) {
            //        console.log("derp")
                    categories[iterator].getSensors().push(jsonContainers[i].name)
                }
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





exports.SensorContainer = SensorContainer;
exports.SensorSet = SensorSet;
exports.SensorCategory = SensorCategory;
exports.initSystem = initSystem;
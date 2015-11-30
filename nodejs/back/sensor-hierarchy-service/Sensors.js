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
        var result = this.sensors;
        for(var child in this.childContainer) {
            var childSensors = this.childContainer[child].getSensors();
            for( var sensor in childSensors) {
                result.push(childSensors[sensor])
            }
        }
        return result;
    };

    getChild() {
        return this.childContainer;
    };

    getFilters() {
        return this.filters;
    }


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

    for(var i in jsonContainers) {
        for(var iterator in containers) {
            for(var filters in containers[iterator].getFilters()) {
                var filter = new RegExp("(?:^|[^A-Za-z])" + containers[iterator].getFilters()[filters], "i");
                if(filter.test(jsonContainers[i].name)) {
                    containers[iterator].getSensors().push(jsonContainers[i].name);
                }
            }
        }
    }
    console.log(containers);
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
    var fourthFloor = new SensorContainer("4th floor", ["SPARKS"] ,[], []);
    var coffeeCorner = new SensorContainer("Coffee corner", ["COFFEE", "CAFE"], [], []);
    var sousRepartiteur = new SensorContainer("Sous repartiteur", ["MW"] , [], []);
    var modalisCorridor = new SensorContainer("Modalis corridor", ["Modalis", "CORRIDOR"], [], []);
    var office445 = new SensorContainer("Office 445", ["445"], [], []);
    var office443 = new SensorContainer("Office 443", ["443"], [], []);
    var office444 = new SensorContainer("Office 444", ["444"], [], []);

    containers.push(campus);
    containers.push(templierWest);
    containers.push(fourthFloor);
    containers.push(coffeeCorner);
    containers.push(sousRepartiteur);
    containers.push(modalisCorridor);
    containers.push(office445);
    containers.push(office443);
    containers.push(office444);


    campus.getChild().push(templierWest);

    templierWest.getChild().push(fourthFloor);

    fourthFloor.getChild().push(coffeeCorner);
    fourthFloor.getChild().push(sousRepartiteur);
    fourthFloor.getChild().push(modalisCorridor);

    modalisCorridor.getChild().push(office445);
    modalisCorridor.getChild().push(office444);
    modalisCorridor.getChild().push(office443);
}

exports.SensorContainer = SensorContainer;
exports.SensorSet = SensorSet;
exports.SensorCategory = SensorCategory;
exports.initSystem = initSystem;
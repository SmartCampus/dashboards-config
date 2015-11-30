/**
 * Created by Quentin on 11/27/2015.
 */
"use strict";
var requesterSC = require("./request_smartcampus");

/**
 * This class represent the set of containers. You shouldn't create SensorSet but {@link SensorContainer} oe {@link SensorCategory}
 * instead. This class is here to hide that there is two type of set, the containers that are the physical containers of the
 * sensors and the Category that are the type of sensor (temperature, ..).
 */
class SensorSet {

    /**
     *  This is the constructor of the class, should only be called by the child classes.
     *
     * @param name      {string}        Name of the set of sensors
     * @param sensors   {array}         Array of all the sensor of the set
     */
    constructor(name, sensors) {
        this.name = name;
        this.sensors = sensors;
    }

    /**
     * This method return the array of all the sensor of the set
     *
     * @returns {array|*}
     */
    getSensors() {
        return this.sensors;
    }

    /**
     * This method return the name of the set.
     *
     * @returns {string|*}
     */
    getName() {
        return this.name;
    }
}

/**
 * This class represent the physical container of the sensors. You create an instance of this class when you want
 * to represent a physical area with a list of sensor, a name, and list of filter to find the corresponding sensor in
 * the API.
 */
class SensorContainer extends SensorSet {

    /**
     * This constructor allow you to create a SensorContainer and call the {@link SensorSet} constructor with the name
     * and the list of sensor.
     *
     * @param name              {string}        Name of the container
     * @param filters           {array}         List of the filters to match with the name of sensor of the API (dirty,
     *                                          but best solution for the moment)
     * @param sensors           {array}         List of all the sensors for the container.
     * @param childContainer    {array}         List of all the child of the container. A child is an other container
     *                                          in this container.
     */
    constructor(name, filters, sensors, childContainer) {
        super(name, sensors);
        this.childContainer = childContainer;
        this.filters = filters;
    }

    /**
     * This method return an array of all the sensor of the container and of the childs of the container.
     *
     * @returns {array|*}
     */
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

    /**
     * This method return an array of the child of the sensor
     *
     * @returns {array|*}
     */
    getChild() {
        return this.childContainer;
    };

    /**
     * This method return an array of the filter to match the name of the sensors in the API.
     *
     * @returns {array|*}
     */
    getFilters() {
        return this.filters;
    }

    /**
     * This method add a filter to the array of filter
     *
     * @param filter
     */
    addFilter(filter) {
        this.filters.push(filter);
    };
}


/**
 * This class represent the category of sensor like the temperature or the state of the door.
 */
class SensorCategory extends SensorSet {

    /**
     * This constructor need the name of the container and his array of sensors. He call the constructor of the mother
     * class {@link SensorSet}
     *
     * @param name          {string}        Name of the category of sensor
     * @param sensors       {array}         List of all the sensor for this category.
     */
    constructor(name, sensors) {
        super(name, sensors);
    }
}

var smartCampus = [];
var categories = [];
var containers = [];

/**
 * This function initialize the system with all the categories and container needed. For that, this function make a
 * request to the SmartCampus API to have the list of all the sensor and then match the sensor with the categories and
 * the containers.
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
 *  This function read the JSON Object return by the SmartCampus API and initialize the categories and the containers.
 *  Then it link the sensors of the list with the containers and the categories
 *
 * @param data      {string}        String representing the JSON Object return by the API of SmartCampus.
 *
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
 //   console.log(containers);
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

/**
 * This function create the different containers and then add it to the list of containers.
 */
function initContainers() {
    /** Create all the containers needed **/
    var campus = new SensorContainer("Campus SophiaTech", ["CAMPUS"], [], []);
    var templierWest = new SensorContainer("Templiers Ouest", [], [], []);
    var fourthFloor = new SensorContainer("4th floor", ["SPARKS"] ,[], []);
    var coffeeCorner = new SensorContainer("Coffee corner", ["COFFEE", "CAFE"], [], []);
    var sousRepartiteur = new SensorContainer("Sous repartiteur", ["MW"] , [], []);
    var modalisCorridor = new SensorContainer("Modalis corridor", ["Modalis", "CORRIDOR"], [], []);
    var office445 = new SensorContainer("Office 445", ["445"], [], []);
    var office443 = new SensorContainer("Office 443", ["443"], [], []);
    var office444 = new SensorContainer("Office 444", ["444"], [], []);

    /** Add the containers in the array of containers **/
    containers.push(campus);
    containers.push(templierWest);
    containers.push(fourthFloor);
    containers.push(coffeeCorner);
    containers.push(sousRepartiteur);
    containers.push(modalisCorridor);
    containers.push(office445);
    containers.push(office443);
    containers.push(office444);

    /** Set the child of every container **/
    campus.getChild().push(templierWest);

    templierWest.getChild().push(fourthFloor);

    fourthFloor.getChild().push(coffeeCorner);
    fourthFloor.getChild().push(sousRepartiteur);
    fourthFloor.getChild().push(modalisCorridor);

    modalisCorridor.getChild().push(office445);
    modalisCorridor.getChild().push(office444);
    modalisCorridor.getChild().push(office443);
}

/**
 * Class representing the physical container of the sensors
 * {@link SensorContainer}
 */
exports.SensorContainer = SensorContainer;

/**
 * Class representing the Set of containers, should not be instantiate.
 * {@link SensorSet}
 */
exports.SensorSet = SensorSet;

/**
 * Class representing the category of sensors.
 * {@link SensorCategory}
 */
exports.SensorCategory = SensorCategory;

/**
 * This function is called to init our system with all the sensors.
 *
 * @type {initSystem}
 */
exports.initSystem = initSystem;
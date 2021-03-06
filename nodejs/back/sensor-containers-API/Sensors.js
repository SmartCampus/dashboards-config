"use strict";
var requesterSC = require("./request_smartcampus"),
    snapshotReader = require('./snapshot_reader.js'),
    fs = require("fs"),
    sensorsJson = JSON.parse(fs.readFileSync(__dirname + "/data/sensors.json", "utf8"));

class Sensor {
    constructor(name, displayName, booleanTitle, description, unit, category, kind) {
        this._name = name;
        this._description = description;
        this._unit = unit;
        this._displayName = displayName;
        this._booleanTitle = booleanTitle;
        this._category = category;
        this._kind = kind;
    }

    get unit() {
        return this._unit;
    }

    get description() {
        return this._description;
    }

    get name() {
        return this._name;
    }

    get displayName() {
        return this._displayName;
    }

    get booleanTitle() {
        return this._booleanTitle;
    }

    get category() {
        return this._category;
    }

    get kind() {
        return this._kind;
    }

    toJson() {
        return {
            name : this._name,
            description : this._description,
            unit : this._unit,
            displayName : this._displayName,
            booleanTitle : this._booleanTitle,
            category : this._category,
            kind : this._kind
        }
    }
}

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
    constructor(name, sensors, filters) {
        this.name = name;
        this.sensors = sensors;
        this.filters = filters;
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

    /**
     * This method will return the array of filter. Those filters are used for the initialisation with the name of the
     * sensors
     *
     * @returns         {array}     Array containing all the filters for the sensorSet
     */
    getFilters() {
        return this.filters;
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
        super(name, [], filters);
        this.childContainer = childContainer;
        this.directSensor = sensors;
        this.amountOfSensors = this.directSensor.length;
    }

    test3(child) {
        for(var i in child.getChild()) {
            this.amountOfSensors += this.amountOfSensors +  child.getChild()[i].getAmountOfSensors();

        }
        this.childContainer.push(child);
    }


    test2(sensor) {
        this.directSensor.push(sensor);
        this.amountOfSensors += this.amountOfSensors + 1;
    }

    test() {
        this.amountOfSensors += this.amountOfSensors + 1;
    }

    /**
     * This method return an array of all the sensor of the container and of the childs of the container.
     *
     * @returns {array|*}
     */
    getSensors() {
        var result = [];
        for(var i in this.directSensor) {
            result.push(this.directSensor[i]);
        }
        for (var child in this.childContainer) {
            var childSensors = this.childContainer[child].getSensors();
            for (var i in childSensors) {
                result.push(childSensors[i]);
            }
        }
        return result;
    };

    /**
     *
     * @returns {array|*}
     */
    getDirectSensors() {
        return this.directSensor;
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
     * This method add a filter to the array of filter
     *
     * @param filter
     */
    addFilter(filter) {
        this.filters.push(filter);
    };

    /**
     * This function return the name of the container
     *
     * @returns {string|*}
     */
    getName() {
        return this.name;
    }

    /**
     * This function return the number representing the amount of sensor for the given container
     *
     * @returns {*}
     */
    getAmountOfSensors() {
        var amount = this.directSensor.length;

        for (var child in this.childContainer) {
            var childAmount = this.childContainer[child].getAmountOfSensors();
            amount += childAmount;
        }

        return amount;
    }

    /**
     * This method will return the array of filter. Those filters are used for the initialisation with the name of the
     * sensors
     *
     * @returns         {array}     Array containing all the filters for the sensorSet
     */
    getFilters() {
        return this.filters;
    }

    toJSON() {
        var json = {
            name : this.name,
            sensors : this.sensors,
            childContainer : this.childContainer,
            directSensor : this.directSensor,
            amountOfSensors : this.getAmountOfSensors()
        }
        return json;
    }
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
    constructor(name, sensors, filters) {
        super(name, sensors, filters);
    }

    /**
     * This method will return the array of filter. Those filters are used for the initialisation with the name of the
     * sensors
     *
     * @returns         {array}     Array containing all the filters for the sensorSet
     */
    getFilters() {
        return this.filters;
    }
}

var smartCampus = [];
var categories = {};
var containers = [];
var sensorList = {};

/**
 * This function return the list of all the containers
 *
 * @returns {Array}
 */
function getContainers() {
    return containers;
}

/**
 * This function initialize the system with all the categories and container needed. For that, this function make a
 * request to the SmartCampus API to have the list of all the sensor and then match the sensor with the categories and
 * the containers.
 */
function initSystem() {
    var sensors = JSON.stringify(snapshotReader.getAllSensors());
    initSensors(sensors);
}


function initSystemWithSmartCampus() {
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
 //   initContainers();

    var json = JSON.parse(data);
    upgradeSensorsInformation(json);

    var jsonContainers = json._items;

    var campus = new SensorContainer("Campus SophiaTech", ["CAMPUS"], [], []);
    var templierWest = new SensorContainer("Templiers Ouest", [], [], []);
    var fourthFloor = new SensorContainer("Fourth floor", ["SPARKS"] ,[], []);
    var coffeeCorner = new SensorContainer("Coffee corner", ["COFFEE", "CAFE"], [], []);
    var sousRepartiteur = new SensorContainer("Sous repartiteur", ["MW"] , [], []);
    var modalisCorridor = new SensorContainer("Modalis corridor", ["Modalis"], [], []);
    var office445 = new SensorContainer("Office 445", ["445"], [], []);
    var office443 = new SensorContainer("Office 443", ["443"], [], []);
    var office444 = new SensorContainer("Office 444", ["444"], [], []);
    // TODO : Solution très sale mais pour les capteurs virtuels y a juste aucune norme !!!
    var virtualSensors = new SensorContainer("Virtual Sensors", ["2V", "NUMBER", "3V", "TEMP_CAMPUS"], [], []);
    var root = new SensorContainer("Root", [], [], []);

    /** Add the containers in the array of containers **/
    containers.push(root);
    containers.push(campus);
    containers.push(templierWest);
    containers.push(fourthFloor);
    containers.push(coffeeCorner);
    containers.push(sousRepartiteur);
    containers.push(modalisCorridor);
    containers.push(office445);
    containers.push(office443);
    containers.push(office444);
    containers.push(virtualSensors);


    for(var i in jsonContainers) {
        for(var iterator in containers) {
            for(var filters in containers[iterator].getFilters()) {
                var filter = new RegExp(containers[iterator].getFilters()[filters], "i");
                var name = jsonContainers[i].name;
                if(filter.test(jsonContainers[i].name) && (sensorList[name] !== undefined) ) {
                    containers[iterator].test2(sensorList[name]);
                }
            }
        }
    }


    /** Set the child of every container **/
    root.getChild().push(campus);

    campus.getChild().push(templierWest);

    templierWest.getChild().push(fourthFloor);

    fourthFloor.getChild().push(coffeeCorner);
    fourthFloor.getChild().push(sousRepartiteur);
    fourthFloor.getChild().push(modalisCorridor);

    modalisCorridor.getChild().push(office445);
    modalisCorridor.getChild().push(office444);
    modalisCorridor.getChild().push(office443);





    for(var i in sensorList) {
        if(sensorList[i].unit === "number") {
            categories.STATE.getSensors().push(sensorList[i]);
        } else if(sensorList[i].unit === "temperature") {
            categories.TEMP.getSensors().push(sensorList[i]);
        } else if(sensorList[i].unit === "lux") {
            categories.LIGHT.getSensors().push(sensorList[i]);
        } else if(sensorList[i].unit === "watt") {
            categories.ENERGY.getSensors().push(sensorList[i]);
        } else if(sensorList[i].unit === "decibel") {
            categories.SOUND.getSensors().push(sensorList[i]);
        }
    }


    for(var iterator in containers) {
        smartCampus.push(containers[iterator]);
    }
    for(var iterator in categories) {
        smartCampus.push(categories[iterator]);
    }
}


/**
 * This method run through all the sensors and create an instance of {Sensor} with an additionnel name, description and unit.
 * For that we check the name of the sensor, if the name is not in the switch then the sensor is not treated
 *
 *
 * @param sensors {json} list of all the sensor
 */
function upgradeSensorsInformation(sensors) {
    for(var iterator in sensors._items) {
        var sensorName = sensors._items[iterator].name;
        var mySensor = sensorsJson[sensorName];
        var sensor = undefined;
        if(typeof mySensor !== "undefined") {
            sensor = new Sensor(mySensor.name, mySensor.displayName, mySensor.booleanTitle, mySensor.description ,mySensor.unit , mySensor.category, mySensor.kind);
        }

        if(typeof sensor !== "undefined") {
            sensorList[sensorName] = sensor.toJson();
        }
    }
}


/**
 *
 * This function init the different categories of sensors, which means the temperature, the doors,
 * the windows and the air conditioning.
 *
 */
function initCategories() {
    var temperatureSensors = new SensorCategory("TEMP", [], ["TEMP", "AC"]);
    var lightSensors = new SensorCategory("LIGHT", [], ["LIGHT"]);
    var numberSensors = new SensorCategory("STATE", [], ["STATE"]);
    var energySensors = new SensorCategory("ENERGY", [], ["ENERGY"]);
    var soundSensors = new SensorCategory("SOUND", [], ["SOUND"]);

    categories.LIGHT = lightSensors;
    categories.TEMP = temperatureSensors;
    categories.STATE = numberSensors;
    categories.ENERGY = energySensors;
    categories.SOUND = soundSensors;
}

/**
 * This function create the different containers and then add it to the list of containers.
 */
function initContainers() {
    /** Create all the containers needed **/
    var campus = new SensorContainer("Campus SophiaTech", ["CAMPUS"], [], []);
    var templierWest = new SensorContainer("Templiers Ouest", [], [], []);
    var fourthFloor = new SensorContainer("Fourth floor", ["SPARKS"] ,[], []);
    var coffeeCorner = new SensorContainer("Coffee corner", ["COFFEE", "CAFE"], [], []);
    var sousRepartiteur = new SensorContainer("Sous repartiteur", ["MW"] , [], []);
    var modalisCorridor = new SensorContainer("Modalis corridor", ["Modalis"], [], []);
    var office445 = new SensorContainer("Office 445", ["445"], [], []);
    var office443 = new SensorContainer("Office 443", ["443"], [], []);
    var office444 = new SensorContainer("Office 444", ["444"], [], []);
    // TODO : Solution très sale mais pour les capteurs virtuels y a juste aucune norme !!!
    var virtualSensors = new SensorContainer("Virtual Sensors", ["2V", "NUMBER", "3V", "TEMP_CAMPUS"], [], []);
    var root = new SensorContainer("Root", [], [], []);

    /** Add the containers in the array of containers **/
    containers.push(root);
    containers.push(campus);
    containers.push(templierWest);
    containers.push(fourthFloor);
    containers.push(coffeeCorner);
    containers.push(sousRepartiteur);
    containers.push(modalisCorridor);
    containers.push(office445);
    containers.push(office443);
    containers.push(office444);
    containers.push(virtualSensors);

    /** Set the child of every container **/
    root.getChild().push(campus);

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
 * This method return the list of all the sensors of the system.
 *
 * @returns {Array}
 */
function getAllSensors()  {
    return smartCampus;
}

/**
 * This method return the list of the sensors of SmartCampus
 * @type {getAllSensors}
 */
exports.getSmartCampusSensors = getAllSensors;

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

/**
 * This function return the list of all the containers
 *
 * @type {getContainers}
 */
exports.getContainers = getContainers;


exports.sensorList = sensorList;
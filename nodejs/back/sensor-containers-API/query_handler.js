/**
 * @author Quentin Cornevin.
 */
var sensors = require('./Sensors.js'),
    requester = require('./request_smartcampus');

/**
 * This method will first call the {@link getSensorsFromQuery} to have a list with the a list of sensor for every
 * query in the request. Then it will run through the list to only have the member in common for every query.
 *
 * @param   queries     {string}        String representing a JSON Object with all the query of the request.
 * @param   res         {response}      Response of the HTTP request.
 */
function handleQuery(queries, callback) {
    var sensorsArray = getSensorsFromQuery(queries);
    var result = checkArrays(sensorsArray);
    callback(result);
}

/**
 * this function check an array compose of several arrays, and return an array with element in common of every array
 *
 * @param   arrays      {array]     This array contains all the array with all the element we want to check.
 * @returns result      {array}     This array contains all the element that are in every array of the input.
 */
function checkArrays(arrays) {
    var result = arrays.shift().filter(function(v) {
        return arrays.every(function(a) {
            return a.indexOf(v) !== -1;
        });
    });
    return result;
}

/**
 * This method ask all the data to the SmartCampus API for the given data.
 *
 * @param       {string}        name of the sensor
 * @param       {string}        interval of date we want the information
 * @param       {function}      callback with one parameter which is the response
 */
function getSensorInformation(name, date, callback) {
    requester.getSensorData(name, date, false, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            callback(tempPerTime);
        });
    });
}

/**
 * This function create an array of all the sensors for the given queries. The queries should be a name of a building
 * and/or a type.
 * Example : if you enter : Office443, you will get all the sensors of the office 443.
 *           if you enter : TEMP, you will get all the sensors of the system.
     *
 * @param       queries         {string}        String with all the query of the request.
 * @returns     sensorArray     {Array}         Array of sensors depending of the queries.
 */
function getSensorsFromQuery(queries) {
    var sensorsArray = [];
    //console.log(queries);
    for(var query in queries) {
        var queryResult = [];
        var smartCampusSensors = sensors.getSmartCampusSensors();
        for(var iterator in smartCampusSensors) {
            var name = smartCampusSensors[iterator].getName();
            if(queries[query] === name.replace(/\s+/g, '')) {
                for(var sensor in smartCampusSensors[iterator].getSensors()) {
                    queryResult.push(sensors.getSmartCampusSensors()[iterator].getSensors()[sensor]);
                }
            }
        }
        sensorsArray.push(queryResult);
    }
    return sensorsArray;
}

/**
 * This function ask the last data registered by the sensor with the given name to smartCampus.
 *
 * @param       {string}        name of the sensor we want the last data.
 * @param       {function}      callback with one parameter which is the response
 */
function getSensorLastInformation(name, callback) {
    requester.getLastSensorData(name, false, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            //response.send(tempPerTime);
            callback(tempPerTime);
        });
    });
}

/**
 * This function ask all the geographic child of the given container to smartCampus.
 *
 * @param       {string}    name of the container which contains the child
 * @param       {function}  callback with one parameter which is the response
 */
function getContainerChild(name, callback) {
    var containerList = sensors.getContainers();
    for(var i in containerList) {
        if(containerList[i].getName().replace(/\s+/g, '') == name) {
            var jsonResponse = {"name" : "Buildings",  childContainer : containerList[i].toJSON()};
            callback(jsonResponse);
        }
    }
}


exports.getSensorLastInformation = getSensorLastInformation;


exports.getSensorInformation = getSensorInformation;

/**
 * This function will check the query param of the request and return the list of sensors corresponding.
 *
 * @type {handleQuery}
 */
exports.handleQuery = handleQuery;

exports.getContainerChild = getContainerChild;



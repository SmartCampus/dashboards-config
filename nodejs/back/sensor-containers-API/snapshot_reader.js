/**
 * @author Quentin Cornevin
 *
 * This module will read the files created by the snapshot of campus and retrieve the information
 * as if it was requesting smartCampuss
 */
var fs = require("fs"),
    moment = require("moment")
    sensorsFile = "./data/snapshot-smartCampus/snapshot/";

/**
 * This function read the sensors.json file and then retrieve all the sensor.
 */
function getAllSensors() {
    var sensors = JSON.parse(fs.readFileSync(sensorsFile + "sensors.json", "utf8"));
    return sensors;
}

/**
 * This function will read the json file corresponding to a snapshot of SmartCampus.
 * It will read the file then retrieve only the information on the interval of the given date.
 * If there is no date then all the data are retrieved.
 *
 * @param       {string}            name of the sensor
 * @param       {string}            interval of date
 * @returns     {{values: json}}    All the data for the given sensor in the given interval of date
 *                                  format : {"values": []}
 */
function getSensorData(name, date) {
    var allSensorData = JSON.parse(fs.readFileSync(sensorsFile + "sensor-" + name + "-data.json"));
    var response = {"values": []};

    if(date) {
        var dates = date.split("/");
        var beginDate = dates[0];
        var endDate = dates[1];
        var beginTimeStamp = moment(beginDate, "YYYY-MM-DD H:mm:ss").valueOf() / 1000;
        var endTimeStamp = moment(endDate, "YYYY-MM-DD H:mm:ss").valueOf() / 1000;

        for (var i in allSensorData.values) {
            if ((allSensorData.values[i].date > beginTimeStamp) && (allSensorData.values[i].date < endTimeStamp)) {
                response.values.push(allSensorData.values[i]);
            }
        }
    } else {
        for (var i in allSensorData.values) {
            response.values.push(allSensorData.values[i]);
        }
    }
    return response;
};


function getSensorLastInformation(name) {
    var allSensorData = JSON.parse(fs.readFileSync(sensorsFile + "sensor-" + name + "-data.json"));
    var response = {"values" : []};
    response.values.push(allSensorData.values[allSensorData.values.length - 1]);
    return response;
};


/**
 *  List of all the exports.
 */

exports.getSensorData = getSensorData;
exports.getAllSensors = getAllSensors;
exports.getSensorLastInformation = getSensorLastInformation;
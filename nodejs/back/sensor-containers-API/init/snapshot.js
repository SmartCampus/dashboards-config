/**
 * Created by Quentin on 2/22/2016.
 */
"use strict";

var http = require("http"),
    SMARTCAMPUS_HOST = "http://smartcampus.unice.fr",
    SENSORS_PATH = "/sensors",
    fs = require("fs"),
    snapShottedSensors = JSON.parse(fs.readFileSync(__dirname + "/../data/snapshot-smartCampus/interesting-sensors.json", "utf-8"));



/**
 * Retrieves all sensors from SmartCampus.
 *
 * @param   {Function}          callback function to call when job is finished with
 *                              the body response from the API call
 */
function getAllSensors(callback) {
    var url = SMARTCAMPUS_HOST + SENSORS_PATH;

    http.get(url, function(res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getAllSensors");
        });
}

/**
 * Retrieves sensor data.
 *
 * @param  {[string]}   name     	the sensor's name
 * @param  {Function} callback 		function to call when job is finished with
 *                             		the body response from the API call
 */
function getSensorData(name, callback) {
    var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/" + name + "/data";
    http.get(url, function (res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getSensorData");
        });
}

/**
 * This function make a request to smartCampus to have all the sensors available then put everything in the
 * file : /data/snapshot-smartCampus/sensors.json
 */
function snapShotAllSensors() {
    getAllSensors(function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end", function() {
            fs.writeFile(__dirname + "/../data/snapshot-smartCampus/snapshot/sensors.json", stringData, function(err) {
                if(err) {
                    console.log(err);
                }

                console.log("File sensors saved !");
            });
        });
    });
}

function snapshotOneSensor(sensorName) {
    getSensorData(sensorName, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
           stringData += chunck;
        });

        res.on("end", function() {
            fs.writeFile(__dirname + "/../data/snapshot-smartCampus/snapshot/sensor-" + sensorName + "-data.json", stringData, function(err) {
                if(err) {
                    console.log(err);
                }

                console.log("File sensors saved !");
            });
        });
    })
}

function snapShotSound(callback){
    var url = SMARTCAMPUS_HOST + SENSORS_PATH + "/NOISE_SPARKS_CORRIDOR/data?date=2016-01-01 00:00:00/2016-02-10 10:00:00";
    http.get(url, function (res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getSensorData");
        });
}



(function takeSnapShot() {
    snapShotAllSensors();
    for(let i in snapShottedSensors) {
        snapshotOneSensor(snapShottedSensors[i]);
    }

    snapShotSound(function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end", function() {
            fs.writeFile(__dirname + "/../data/snapshot-smartCampus/snapshot/sensor-NOISE_SPARKS_CORRIDOR-data.json", stringData, function(err) {
                if(err) {
                    console.log(err);
                }

                console.log("File sensors saved !");
            });
        });
    });
})();

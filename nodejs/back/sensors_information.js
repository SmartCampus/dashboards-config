/**
 * @author Quentin Cornevin
 *
 * Module responsible for creating the good request to the SmartCampus API.
 */

var requestSmartcampus = require("./request_smartcampus");

/**
 * This method will retrieve
 *
 * @param date
 * @param officeNumber
 * @param callback
 */
function getDeskTemperature(date, officeNumber ,callback) {
        requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", date, false, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
        })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);

            var responseInGoodFormat = {"data": []};

            for(var i in tempPerTime.values) {
                var temperaturePerTime = [];
                temperaturePerTime.push(tempPerTime.values[i].date);
                temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
                responseInGoodFormat.data.push(temperaturePerTime);
            }

            callback.send(responseInGoodFormat);
        })
    });
}


function getCampusTemperature(date, callback) {
    requestSmartcampus.getSensorData("TEMP_CAMPUS", date, false, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
            stringData += chunck;
        })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);

            var responseInGoodFormat = {"data": []};

            for(var i in tempPerTime.values) {
                var temperaturePerTime = [];
                temperaturePerTime.push(tempPerTime.values[i].date);
                temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
                responseInGoodFormat.data.push(temperaturePerTime);
            }

            callback.send(responseInGoodFormat);
        })
    });
}


function getDoorsState(callback) {
    requestSmartcampus.getSensorData("DOOR443STATE", "", true, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}


/**
 * This method retieve all the data for the state of the window of the given office number
 *
 * @param {Function} callback     function to call when the job is finish with the body response
 *                                from the API call
 * @param officeNumber
 */
function getWindowsState(callback, officeNumber) {
    requestSmartcampus.getLastSensorData("WINDOW" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}

// TODO : si on veut normaliser faudrait que le capteur soit sur /AC443 et pas /AC_443 (meme synthase que la fenetre)
function getAirConditionerState(callback, officeNumber) {
    requestSmartcampus.getLastSensorData("AC_" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}



exports.getAirConditionerState = getAirConditionerState;
exports.getDeskTemperature = getDeskTemperature;
exports.getWindowsState = getWindowsState;
exports.getCampusTemperature = getCampusTemperature;
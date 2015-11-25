/**
 * Created by Quentin on 11/24/2015.
 */


var requestSmartcampus = require("./request_smartcampus");


function getDeskTemperature(date, officeNumber ,callback) {           // 2015-09-01 00:00:00/2015-10-01 00:00:00
    requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", date, true, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
        })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);

            var responseInGoodFormat = {"temperatures": [], "time" : []};
            for(var i in tempPerTime.values) {
                responseInGoodFormat.temperatures.push(parseFloat(tempPerTime.values[i].value));
                responseInGoodFormat.time.push(tempPerTime.values[i].date);
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



exports.getDeskTemperature = getDeskTemperature;
exports.getWindowsState = getWindowsState;
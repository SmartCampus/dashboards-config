/**
 * Created by Quentin on 11/24/2015.
 */


var requestSmartcampus = require("./request_smartcampus"),
    smartCampusModel = require("./smartcampus_model.js");


function getDeskTemperature(date, officeNumber ,callback) {           // 2015-09-01 00:00:00/2015-10-01 00:00:00
   // requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", "2015-10-13 00:00:00/2015-10-14 00:00:00", true, function (res) {
    requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", date, true, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
        })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            var temp = [];
            var time = [];
            console.log(tempPerTime.values[0].value);
            var responseInGoodFormat = {"temperatures": [], "time" : []};


            for(var i in tempPerTime.values) {
             //   responseInGoodFormat.temperatures.push(parseInt((Math.round(tempPerTime.values[i].value).toFixed(2))));
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
            callback.send(stringData);
        });
    });
}


exports.getDeskTemperature = getDeskTemperature;
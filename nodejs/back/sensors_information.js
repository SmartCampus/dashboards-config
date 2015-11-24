/**
 * Created by Quentin on 11/24/2015.
 */


var requestSmartcampus = require("./request_smartcampus"),
    smartCampusModel = require("./smartcampus_model.js");


function getDeskTemperature(officeNumber ,callback) {
    requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", "", true, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
       })
        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            var temp = [];
            var time = [];
            console.log(tempPerTime.values[0].value);
            for(var i in tempPerTime.values) {
                temp.push(Math.round(tempPerTime.values[i].value).toFixed(2)); // Put only 2 number after the comma
                time.push(tempPerTime.values[i].date);
            }
            var responseInGoodFormat = {
                "tempratures": temp,
                "time" : time
            }

            callback.send(responseInGoodFormat);
        })
    });
}


exports.getDeskTemperature = getDeskTemperature;
/**
 * Created by Quentin on 11/24/2015.
 */


var requestSmartcampus = require("./request_smartcampus"),
    smartCampusModel = require("./smartcampus_model.js");


function getDeskTemperature(officeNumber ,callback) {
    requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", "2015-09-01 00:00:00/2015-10-01 00:00:00", false, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
       })
        res.on("end" , function() {
            callback.send(stringData);
        })
    });
}


exports.getDeskTemperature = getDeskTemperature;
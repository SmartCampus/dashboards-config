/**
 * Created by Quentin on 11/24/2015.
 */


var requestSmartcampus = require("./request_smartcampus"),
    smartCampusModel = require("./smartcampus_model.js");


function getDesk443Temperature(officeNumber ,callback) {
    requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", "", false, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
       })
        res.on("end" , function() {
            callback.send(stringData);
        })
    });
}


exports.getDesk443Temperature = getDesk443Temperature;
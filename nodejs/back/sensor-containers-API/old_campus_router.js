var express = require("express"),
    queryHandler = require('./query_handler.js'),
    sensorData = require('./Sensors.js'),
    router = express.Router(),
    snapshotReader = require("./snapshot_reader");


/**
 * This route is here to retrieve all the sensors available in smartCampus
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    var count = Object.keys(queries).length;

    if(count != 0) {
        queryHandler.handleQuery(queries, function(jsonResponse) {
            putValueInResponse(res, jsonResponse);
        });
    } else {
        res.send("Sorry please enter a container in the query parameters." +
            "Here is the list of all the valid containers" +
            "CampusSophiaTech - TempliersOuest - 4thfloor - Coffeecorner - Sousrepartiteur - Modaliscorridor" +
            "Office445 - Office443 - Office444 - TEMP - LIGHT - STATE- ENERGY - VirtualSensors. Exemple of valid request " +
            "/sensors?container1=Office443")
    }
});

/**
 * This route allow the user to have all the information about the sensor with the givenId for the date given in the
 * the query param.
 */
router.get("/sensor/:sensorId/data", function(req, res) {
    var sensorId = req.params.sensorId;
    var date;
    if(req.query.date !== undefined) {
        date = req.query.date;
    }

     queryHandler.getSensorInformation(sensorId, date, function(jsonResponse) {
        putValueInResponse(res,jsonResponse);
     });
});

/**
 * This rouute allow the user to have the last data registered by the given sensor.
 */
router.get("/sensor/:sensorId/data/last", function(req, res) {
    var sensorId = req.params.sensorId;
    queryHandler.getSensorLastInformation(sensorId, function(jsonResponse) {
        putValueInResponse(res,jsonResponse);
    });
});


function putValueInResponse(res, jsonResponse) {
    res.send(jsonResponse);
}

module.exports = router;
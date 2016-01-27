var express = require("express"),
    queryHandler = require('./query_handler.js'),
    sensorData = require('./Sensors.js'),
    router = express.Router();


/**
 * This route
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    var count = Object.keys(queries).length

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


router.get("/container/:containerId/child", function(req, res) {
    var sensor = req.params.containerId;
    queryHandler.getContainerChild(sensor, function(jsonResponse) {
        putValueInResponse(res, jsonResponse)
    });
});

/**
 *
 */
router.get("/sensor/:sensorId/data", function(req, res) {
    var sensorId = req.params.sensorId;
    var date = "";
    console.time("call-to-real-smartcampus");
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    queryHandler.getSensorInformation(sensorId, date, function(jsonResponse) {
        putValueInResponse(res,jsonResponse);
    });
});

/**
 *
 */
router.get("/sensor/:sensorId/data/last", function(req, res) {
   var sensorId = req.params.sensorId;
    queryHandler.getSensorLastInformation(sensorId, function(jsonResponse) {
        putValueInResponse(res,jsonResponse);
    });
});


router.get("/sensor/:sensorName/fullInformation", function(req, res){
    var sensorName = req.params.sensorName;
    console.log(sensorName);
    if(sensorData.sensorList[sensorName] !== undefined) {
        res.send(sensorData.sensorList[sensorName]);
    }
});


function putValueInResponse(res, jsonResponse) {
    res.send(jsonResponse);
   // console.timeEnd("call-to-real-smartcampus");
}


module.exports = router;
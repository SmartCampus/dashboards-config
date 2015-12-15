var express = require("express"),
    queryHandler = require('./query_handler.js'),
    router = express.Router();


/**
 * This route
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    console.log(queries);
    if(queries.keys({}).length != 0) {
        queryHandler.handleQuery(queries, res);
    } else {
        res.send("Sorry please enter a container in the query parameters." +
            "Here is the list of all the valid containers" +
            "CampusSophiaTech - TempliersOuest - 4thfloor - Coffeecorner - Sousrepartiteur - Modaliscorridor" +
            "Office445 - Office443 - Office444 - TEMP - DOOR - AC - WINDOW - VirtualSensors. Exemple of valid request " +
            "/sensors?container1=Office443")
    }
});


router.get("/container/:containerId/child", function(req, res) {
    var sensor = req.params.containerId;
    queryHandler.getContainerChild(sensor, res);
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
    queryHandler.getSensorInformation(sensorId, date, res);
});

/**
 *
 */
router.get("/sensor/:sensorId/data/last", function(req, res) {
   var sensorId = req.params.sensorId;
    queryHandler.getSensorLastInformation(sensorId, res);
});



module.exports = router;
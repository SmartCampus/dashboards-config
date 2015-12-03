var express = require("express"),
    queryHandler = require('./query_handler.js'),
    router = express.Router();


/**
 *
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    queryHandler.handleQuery(queries,res);
});


router.get("/sensor/:sensorId/child", function(req, res) {
    var sensor = req.params.sensorId;
    console.log("Yo : " + sensor);
    queryHandler.getContainerChild(sensor, res);
});

/**
 *
 */
router.get("/sensor/:sensorId/data", function(req, res) {
    var sensorId = req.params.sensorId;
    var date = "";
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
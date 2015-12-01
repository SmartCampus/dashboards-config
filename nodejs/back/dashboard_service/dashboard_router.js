/**
 * Created by Quentin on 11/30/2015.
 */

var express = require("express"),
    request_handler = require("./request_handler"),
    router = express.Router();


/**
 *
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    request_handler.requestSensors(queries,res);
});

/**
 *
 */
router.get("/sensor/:sensorId/data", function(req, res) {
    var sensorId = req.params.sensorId;
    var date = "", state = false;
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    if(req.query.state !== undefined) {
        state = reeq.query.state;
    }
    request_handler.getSensorInformation(sensorId, date, state,res);
});

/**
 *
 */
router.get("/sensor/:sensorId/data/last", function(req, res) {
    var sensorId = req.params.sensorId;
    request_handler.getSensorLastInformation(sensorId, res);
});




module.exports = router;
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
    console.log('one call for ', req.params.sensorId, '\n');
    console.time("Get-specific-sensor-data");
    var sensorId = req.params.sensorId;
    var date = "", state = false;
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    if(req.query.state !== undefined) {
        state = req.query.state;
    }
    request_handler.getSensorInformation(sensorId, date, state,res);

});


router.get("/sensor/:sensorId/data/percent", function(req, res) {
    console.log('one call for ', req.params.sensorId, '\n');
    console.time("Get-specific-sensor-percent-data");
    var date = "";
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    request_handler.getInformationInPercent(req.params.sensorId, date, res);
});

router.get("/container/:containerId/child", function(req, res) {
    var sensor = req.params.containerId;
    request_handler.getContainersChild(sensor, res);
});

router.get("/sensor/:sensorId/data/splitList", function(req, res) {
    console.log('one call for ', req.params.sensorId, '\n');
    console.time("Get-specific-sensor-splitList-data");
    var sensorId = req.params.sensorId;
    var date = "";
    if(req.query.date !== undefined) {
        date = req.query.date;
    }

    request_handler.getStateInformationSplit(sensorId, date,res);
});

router.get("/sensor/:sensorId/data/last", function(req, res) {
    var sensorId = req.params.sensorId;
    request_handler.getLastInformation(sensorId, res);
});

router.get("/sensor/:sensorId/data/reverse", function(req, res) {
    var sensorId = req.params.sensorId;
    if(sensorId != "AC_443STATE") {
        res.send("Sorry bad sensor, this route should be used for AC_443 only.");
    } else {

        var date = "";
        if (req.query.date !== undefined) {
            date = req.query.date;
        }

        request_handler.getReversedInformation(sensorId, date, function (value) {
            console.log("yolo");
            res.send(value);
        })
    }
});


module.exports = router;
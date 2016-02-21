/**
 * Created by Quentin on 11/30/2015.
 */

var express = require("express"),
    request_handler = require("./request_handler"),
    processor = require("./response_processor"),
    router = express.Router();

/**
 *  This route allow the user to have the list of all the sensors with the container given in query param
 *  Example : /sensors?container=CampusSophiaTech
 */
router.get("/sensors", function(req, res) {
    var queries = req.query;
    request_handler.requestSensors(queries,res);
});

/**
 * This route allow the user to have the data for the sensor with the given id for the interval of date given in query param
 * If no date are given, all the data are sent.
 */
router.get("/sensor/:sensorId/data", function(req, res) {
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

/**
 * This route allow the user to have the data retrieved in percent. Only work if the category of the sensor is STATE.
 */
router.get("/sensor/:sensorId/data/percent", function(req, res) {
    var date = "";
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    request_handler.getInformationInPercent(req.params.sensorId, date, res);
});

/**
 * This route allow the user to have all the geographic child for the given container.
 */
router.get("/container/:containerId/child", function(req, res) {
    var sensor = req.params.containerId;
    request_handler.getContainersChild(sensor, function(response) {
        res.send(response);
    });
});

/**
 * This route allow the user to have the information about the sensor with the given id in two different list.
 * Format needed for a HighCharts graph
 */
router.get("/sensor/:sensorId/data/splitList", function(req, res) {
    var sensorId = req.params.sensorId;
    var date = "";
    if(req.query.date !== undefined) {
        date = req.query.date;
    }
    request_handler.getStateInformationSplit(sensorId, date,res)
});

/**
 * This route allow the user to have the last data for the sensor with the given Id.
 */
router.get("/sensor/:sensorId/data/last", function(req, res) {
    var sensorId = req.params.sensorId;
    request_handler.getLastInformation(sensorId, res);
});

/**
 *
 */
router.get("/sensor/:sensorId/data/reverse", function(req, res) {
    var sensorId = req.params.sensorId;
    if(sensorId != "AC_443STATE") {
        res.send("Sorry bad sensor, this route should be used for AC_443STATE only.");
    } else {

        var date = "";
        if (req.query.date !== undefined) {
            date = req.query.date;
        }

        request_handler.getReversedInformation(sensorId, date, function (value) {
            res.send(value);
        })
    }
});

/**
 * This route allow the user to have all the sensors sorted in a hierarchical way.
 */
router.post("/sensors/common/hierarchical", function(req, res) {
    var givenSensor = req.body.sensors;
    console.log(givenSensor);
    request_handler.getContainersChild("Root", function(response) {
        processor.sortHierarchicalSensor(givenSensor, response, function(response, err) {
            if(err) {
                res.sendStatus(400);
            } else {
                res.send(response);
            }
        })
    });
});

/**
 * This route allow the user to have more information about the sensor with the given sensorName
 */
router.get("/sensor/:sensorName/enhanced", function(req, res) {
    var sensorName = req.params.sensorName;
    request_handler.getSensorsEnhancedInformation(sensorName, function(response, err) {
       if(response != null) {
           res.send(response);
       } else {
           res.sendStatus(404);
       }
    });
});

module.exports = router;
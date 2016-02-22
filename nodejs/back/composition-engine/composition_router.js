/**
 * @author Quentin Cornevin, Marc Karassev
 */

var router = require("express").Router(),
    widget = require('./widget'),
    needs = require("./needs"),
    logger = require("./logger");

router.post("/expressNeed", function(req,res) {
    var body = req.body;
    if(body == undefined || body.needs == undefined) {
        res.send(422)
    } else {
        widget.findCorrespondingWidget(body.needs, function (response) {
            if (response == undefined) {
                res.send(422);
            } else {
                res.send(response);
            }
        });
    }
});

router.post("/needSet", function (req, res) {
    var needArray = needs.getNeedsByName(req.body.needs);

    if (needArray.length == 0) {
        res.status(400).send({
            incorrectNeeds: "at least one need is incorrect or there's no needs"
        });
    }
    else {
        needs.getSensorsMatchingNeeds(needArray, function (error, result) {
            if (error) {
                if (error.unconsistentNeedSet) {
                    res.status(400);
                }
                else {
                    logger.debug(error);
                    res.status(500);
                }
                res.send(error);
            }
            else {
                res.status(200).send(result);
            }
        });
    }
});

router.post("/sensorSet", function (req, res) {
    needs.getNeedsMatchingSensors(req.body.sensors, function (error, result) {
        if (error) {
            logger.debug(error);
            // TODO check err and return status
            res.send(error.message);
        }
        else {
            var toSend = [];

            result.forEach(function (need) {
                toSend.push({ name: need.name });
            });
            res.status(200).send(toSend);
        }
    });
});

// Exports

module.exports = exports = router;
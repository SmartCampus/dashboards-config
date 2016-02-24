/**
 * @author Marc Karassev, Quentin Cornevin
 */

var router = require("express").Router(),
    widget = require('./widget'),
    needs = require("./needs"),
    logger = require("./logger");

/**
 * Handles POST requests on /expressNeed path. Returns matching widget types
 * to given visualization needs.
 *
 * @param [string]  req.body    Expects the request body to be set to a JSON array
 *                                  of strings representing needs.
 *                              Available needs: "Comparison", "Overtime",
 *                                  "Proportion", "See Status", "Relationships",
 *                                  "Hierarchy", "Summarize" and "Pattern".
 * @return string   res.body    Answers with a widget type name. Existing widget types:
 *                                  line, column, mix, pieChart, boolean and scatterplot
 *                              Might send 422 status codes in case of unprocessable inputs.
 */
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

/**
 * Handles POST requests on /needSet path. Returns matching sensor categories
 * to given visualization needs.
 *
 * @param [string]  req.body    Expects the request body to be set to a JSON array
 *                                  of strings representing needs.
 *                              Available needs: "Comparison", "Overtime",
 *                                  "Proportion", "See Status", "Relationships",
 *                                  "Hierarchy", "Summarize" and "Pattern".
 * @return [JSON]   res.body    Answers with an array of sensor sets (categories)
 *                                  matching the given needs. Sensor set format:
 *                                      {
 *                                          "set": "category_name",
 *                                          "sensors": [{sensor object}]
 *                                      }
 *                                  sensor objects are defined in the sensor container API;
 *                              Might send 400 status codes in case of incorrect needs or
 *                                  incompatible needs.
 */
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
                    logger.error(error);
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

function checkSensors(sensors) {
    for (var i in sensors) {
        if (!sensors[i].category) {
            return false;
        }
    }
    return true;
}

/**
 * Handles POST requests on /sensorSet path. Returns matching needs to  the given
 * sensors.
 *
 * @param [string]  req.body    Expects the request body to be set to a JSON array
 *                                  of sensor objetcs. Sensor objects are defined
 *                                  in the sensor container API.
 * @return [JSON]   res.body    Answers with an array of strings representing needs
 *                                  matching the given sensors.
 *                              Available needs: "Comparison", "Overtime",
 *                                  "Proportion", "See Status", "Relationships",
 *                                  "Hierarchy", "Summarize" and "Pattern".
 *                              Might send 400 status codes in case of invalid sensors
 *                                  or invalid sensors categories.
 */
router.post("/sensorSet", function (req, res) {
    var sensors = req.body.sensors;

    if (!sensors || !Array.isArray(sensors) || !checkSensors(sensors)) {
        res.status(400).send({ invalidJson: true });
    }
    else {
        needs.getNeedsMatchingSensors(sensors, function (error, result) {
            if (error) {
                if (error.invalidCategories) {
                    res.status(400);
                }
                else {
                    logger.error(error);
                    res.status(500);
                }
                res.send(error);
            }
            else {
                var toSend = [];

                result.forEach(function (need) {
                    toSend.push({ name: need.name });
                });
                res.status(200).send(toSend);
            }
        });
    }
});

// Exports

module.exports = exports = router;
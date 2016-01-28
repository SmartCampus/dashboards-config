/**
 * @author Quentin Cornevin, Marc Karassev
 */

var router = require("express").Router(),
    widget = require('./widget'),
    needs = require("./needs"),
    logger = require("./logger");

router.post("/expressNeed", function(req,res) {
    var body = req.body;
    console.log(body);
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
	needs.getSensorsMatchingNeeds(needs.getNeedsByName(req.body),
        function (error, result) {
		if (error) {
			logger.debug(error);
            if (error.unconsistentNeedSet) {
                res.status(400);
            }
            else {
			    res.status(500);
            }
            res.send(error.message);
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.post("/sensorSet", function (req, res) {
    needs.getNeedsMatchingSensors(req.body, function (error, result) {
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
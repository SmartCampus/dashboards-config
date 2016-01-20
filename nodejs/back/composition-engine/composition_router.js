/**
 * @author Quentin Cornevin, Marc Karassev
 */

var router = require("express").Router(),
    widget = require('./widget'),
    winston = require("winston");

var logger = new winston.Logger({
	transports: [
		new winston.transports.Console({colorize: true})
	]
});

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
	widget.checkSetConsistency(req.body, function (error, result) {
		if (error) {
			logger.warn(error);
			// TODO check error, update response
			res.status("500").send("could not check need set consistency");
		}
		else {
			// TODO use something else than widget
		}
	});
});

module.exports = exports = router;
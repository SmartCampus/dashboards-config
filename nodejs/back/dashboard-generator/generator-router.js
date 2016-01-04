/**
 * @author Quentin Cornevin, Marc Karassev
 */

var express = require("express"),
    router = express.Router(),
    generator = require("./generator");

router.post("/generateWidget", function(req, res) {
    jobsRouter(req.body, res);
});

function jobsRouter(message, res) {
    var method = message.job;
    switch (method) {
        case "compareTemperature":
            generator.loadTemperatureGraph(message.config, res);
            break;
        case "barGraph" :
            generator.loadBarGraph(message.config, res);
            break;
        case "generateBoolean":
            generator.loadBooleanGraph(message.config, res);
            console.log(message.config);
            break;
        case "generateWidget":
            generator.generateWidget(message.config, function(data) {
                res.send(data);
            });
            break;
        case "generatePie":
            generator.generatePie(message.config, function(data) {
                res.send(data);
            });
            break;
        default :
            res.send("Bad JSON");
    }
}

// Exports

module.exports = router;
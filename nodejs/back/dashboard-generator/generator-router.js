/**
 * @author Quentin Cornevin, Marc Karassev
 */

var express = require("express"),
    router = express.Router(),
    generator = require("./generator");

router.post("/generateWidget", function(req, res) {
    jobsRouter(req.body, res);
});

function jobsRouter(document, res) {
    var method = document.job;
    switch (method) {
        case "compareTemperature":
            generator.loadTemperatureGraph(document.config, res);
            break;
        case "barGraph" :
            generator.loadBarGraph(document.config, res);
            break;
        case "generateBoolean":
            generator.loadBooleanGraph(document.config, res);
            console.log(document.config);
            break;
        case "generateWidget":
            generator.generateWidget(document.config, function(data) {
                res.send(data);
            });
            break;
        default :
            res.send("Bad JSON");
    }
}

// Exports

module.exports = router;
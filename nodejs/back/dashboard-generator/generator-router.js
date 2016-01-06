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
        case "generateBoolean":
            generator.generateBoolean(message.config, res);
            console.log(message.config);
            break;
        case "generateGraph":
            generator.generateGraph(message.config, function(data) {
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
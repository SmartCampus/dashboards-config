/**
 * @author Quentin Cornevin, Marc Karassev
 */

var express = require("express"),
    router = express.Router(),
    layout = require("./layout_definitions"),
    generator = require("./generator");

router.post("/generationRequest", function(req, res) {
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
        case "generateLayout":
            generator.generateLayout(message.config, function(err, data) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                else {

                    res.send(data);
                }
            });
            break;
        default:
            res.send("Bad job");
    }
}

router.get("/:widgetType/widgetList", function(req ,res) {
    var widget = req.params.widgetType
   console.log(widget);
    if(layout.widgetIdList[widget]) {
        res.send(layout.widgetIdList[widget]);
    } else {
        res.sendStatus(404);
    }
});


// Exports

module.exports = router;
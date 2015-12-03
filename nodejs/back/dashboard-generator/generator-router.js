/**
 * Created by Quentin on 12/3/2015.
 */

var express = require("express"),
    router = express.Router(),
    generator = require("./generator");
    ;


router.post("/generateWidget", function(req, res) {
    //generator.loadTemperatureGraph(res);
   // console.log(req.body);
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
        default :
            res.send("Bad JSON");
    }
}

module.exports = router;
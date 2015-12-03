/**
 * Created by Quentin on 12/3/2015.
 */

var express = require("express"),
    router = express.Router(),
    generator = require("./generator");


router.post("/generateWidget", function(req, res) {
    generator.loadTemperatureGraph(res);
});


module.exports = router;
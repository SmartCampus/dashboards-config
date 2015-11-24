/**
 * Created by Quentin on 11/24/2015.
 */

var express = require("express"),
    sensor = require("./sensors_information")
    router = express.Router();


router.get('/office/:officeNumber/temperature', function(req, res) {
    //console.log("request received");
    sensor.getDesk443Temperature(req.params.officeNumber,res);
});


module.exports = router;

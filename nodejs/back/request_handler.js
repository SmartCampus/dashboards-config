/**
 * Created by Quentin on 11/24/2015.
 */

var express = require("express"),
    sensor = require("./sensors_information")
    router = express.Router();


router.get('/office/:officeNumber/temperature', function(req, res) {
    console.log(req.query.date);
    var date = req.query.date;

    res.setHeader('Content-Type', 'application/json');
    sensor.getDeskTemperature(date,req.params.officeNumber,res);
});


router.get('/office/443/door_status', function(req, res) {

});

module.exports = router;

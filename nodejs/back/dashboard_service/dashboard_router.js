/**
 * Created by Quentin on 11/30/2015.
 */

var express = require("express"),
    router = express.Router();



router.get("/sensors", function(req, res) {
    res.send("YOLO");
});

module.exports = router;
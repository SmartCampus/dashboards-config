var express = require("express"),
    router = express.Router();



router.get("/sensors", function(req, res) {
    console.log(req.query);
    res.send("Derp");
});

module.exports = router;
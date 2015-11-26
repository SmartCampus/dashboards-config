var express = require("express"),
    router = express.Router();

router.get("/:campus", function (req, res) {
	res.end("Ya rien ici !");
});

module.exports = router;
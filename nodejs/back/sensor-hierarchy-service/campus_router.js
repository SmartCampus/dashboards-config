var express = require("express"),
    queryHandler = require('./query_handler.js'),
    router = express.Router();



router.get("/sensors", function(req, res) {
    var queries = req.query;
    queryHandler.handleQuery(queries,res);
});

module.exports = router;
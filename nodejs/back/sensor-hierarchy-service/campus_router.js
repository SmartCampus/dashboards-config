var express = require("express"),
    queryHandler = require('./query_handler.js'),
    router = express.Router();



router.get("/sensors", function(req, res) {
    var queries = req.query;
    queryHandler.handleQuery(queries,res);
});

router.get("/data", function(req, res) {
    var queries = req.query;
    var date = "";
    for(var query in queries) {
        if(query == "date") {
            date = query;
            delete queries['date'];
        }
    }
    console.log(queries);
    queryHandler.getSensorInformation(queries, date, res);
});



module.exports = router;
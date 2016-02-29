/**
 * @author Quentin Cornevin, Marc Karassev
 */

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    router = require("./router"),
    logger = require("./logger")
    port = 8084;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/", router);

(function init() {
    router.init(function (err) {
        if (err) {
            logger.error(err);
            //app.cleanBeforeExit();
            exit(1);
        }
        else {
            app.listen(port);
            logger.info("Composition engine service is now listening on port", port + ".");
            app.emit("ready");
        }
    });
})();

// Exports

module.exports = exports = app;
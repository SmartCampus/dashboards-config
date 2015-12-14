var express = require("express"),
	campusRouter = require("./campus_router"),
	sensors = require("./Sensors"),
	app = express();

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

app.use("/", campusRouter);

/**
 * This function initialize the system with all the different category of sensor sets.
 */
(function init() {
	sensors.initSystem();
})();

app.listen(8081);
console.log('Sensor Hierarchy Service is now listening on port 8081.');
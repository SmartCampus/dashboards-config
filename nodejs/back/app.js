/**
 * Main app.
 */
var express = require("express"),
	bodyParser = require("body-parser"),
	requestHandler = require("./request_handler")
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


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use("/",requestHandler);

app.listen(8081);
console.log('Back end server is now listening on port 8081. ');
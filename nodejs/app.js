var express = require("express"),
	app = express();

//app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/front/views"));
app.use("/bower_components/jquery",
	express.static(__dirname + "/bower_components/jquery"));
app.use("/bower_components/highcharts",
	express.static(__dirname + "/bower_components/highcharts-release"));
app.use("/scripts", express.static(__dirname + "/front/scripts"));

app.listen(8080);
console.log("Server listening on port 8080.");
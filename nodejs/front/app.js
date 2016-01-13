var express = require("express"),
	app = express();

app.use(express.static(__dirname + "/views"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/styles", express.static(__dirname + "/styles"));


app.use("/bower_components/jquery",
	express.static(__dirname + "/bower_components/jquery"));
app.use("/bower_components/highcharts",
	express.static(__dirname + "/bower_components/highcharts-release"));
app.use("/bower_components/highstock",
	express.static(__dirname + "/bower_components/highstock"));

app.use("/bower_components/bootstrap",
	express.static(__dirname + "/bower_components/bootstrap"));
app.use("/bower_components/bootstrap-treeview",
	express.static(__dirname + "/bower_components/bootstrap-treeview"));

app.use("/bower_components/moment",
	express.static(__dirname + "/bower_components/moment"));
app.use("/bower_components/bootstrap-datetimepicker",
	express.static(__dirname + "/bower_components/eonasdan-bootstrap-datetimepicker"));


app.use("/bower_components/jquery-ui",
    express.static(__dirname + "/bower_components/jquery-ui"));

app.use("/bower_components/gridstack",
	express.static(__dirname + "/bower_components/gridstack"));
app.use("/bower_components/gridster",
	express.static(__dirname + "/bower_components/gridster"));


app.listen(process.env.PORT || 8080);
console.log("Server listening on port " + (process.env.PORT || 8080) + ".");

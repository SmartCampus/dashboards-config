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

//404 not found
app.get('/*', function (req, res) {
	res.send("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Page not found :(</title>"
	+"<style>	html {"
	+"	background:url('../assets/images/luke.jpg') no-repeat center center fixed;"
	+"		-webkit-background-size: cover;"
	+"-moz-background-size: cover;"
	+"-o-background-size: cover;"
	+"background-size: cover;}"
	+"</style> 	</head>	<body>	<h1>Sorry, we couldn't find your page !</h1>" +
			"Come back to the index while Luke looks for it for you...	</body>	</html>" );
});
app.listen(process.env.PORT || 8080);
console.log("Server listening on port " + (process.env.PORT || 8080) + ".");

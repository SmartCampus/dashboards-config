var express = require("express"),
	app = express();

app.use(express.static(__dirname + "/views"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/styles", express.static(__dirname + "/styles"));


app.use("/bower_components",
	express.static(__dirname + "/bower_components"));

app.use("/libs/blockrain",
	express.static(__dirname + "/libs/blockrain"));
app.use("/libs/dragIcon",
	express.static(__dirname + "/libs/dragIcon"));

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

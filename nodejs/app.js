var express = require("express"),
	app = express();

app.get("/", function (req, res) {
	res.render("index.html");
});

app.engine("html", require("ejs").renderFile);
app.set("views", "front/views");
app.set("scripts", "front/scripts");

app.listen(8080);
console.log("Server listening on port 8080. ");
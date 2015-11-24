var express = require("express"),
	app = express();

app.get("/", function (req, res) {
	res.render("index.html");
});

app.engine("html", require("ejs").renderFile);
app.set("views", "front/views");
app.listen(8080);
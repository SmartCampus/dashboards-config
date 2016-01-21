/**
 * @author Marc Karassev
 */

var http = require("http"),
	logger = require("./logger"),
	SMARTCAMPUS_HOST = "http://localhost:8081",
	SENSORS_PATH = "/sensors";

function getSensorsByCategory(category, callback) {
	var url = SMARTCAMPUS_HOST + SENSORS_PATH + "?category=" + category;

	http.get(url, function (res) {
		var data = "";

		res.on("data", function (chunk) {
			data += chunk;
		});
		res.on("end", function () {
			callback(null, data);
		});
	}).on("error", function (error) {
		logger.error(error);
		callback(error, null);
	});
}
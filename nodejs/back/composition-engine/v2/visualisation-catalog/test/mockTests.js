/**
 * @author Marc Karassev
 *
 * Visualization catalog mock tests guaranting and documenting expected behavior.
 */

var request = require("supertest"),
	async = require("async"),
	assert = require("assert"),
	app = require("../app"),
	logger = require("../logger");

describe("visualization catalog mock", function () {

	describe("GET charts", function () {
		var chartsPath = "/charts";

		it("should return Line and Bar Chart as first result", function (done) {
			var querystring = "?grouped=true&functions=Comparisons-Data over time"
				+ "-Relationships-Patterns-Distribution";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Line and Bar Chart");
				})
				.end(done);
		});

		it("should return Pie Chart as first result", function (done) {
			var querystring = "?grouped=false&functions=Comparisons-Part to a whole"
				+ "-Proportions";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Pie Chart");
				})
				.end(done);
		});

		it("should return Scatterplot as first result", function (done) {
			var querystring = "?grouped=false&functions=Patterns-Relationships";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Scatterplot");
				})
				.end(done);
		});

		it("should return Boolean as first result", function (done) {
			var querystring = "?grouped=false&functions=Status";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Boolean");
				})
				.end(done);
		});

		it("should return Line Graph as first result", function (done) {
			var querystring = "?grouped=false&functions=Patterns-Data over time";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Line Graph");
				})
				.end(done);
		});

		it("should return Line Graph as first result", function (done) {
			var querystring = "?grouped=true&functions=Patterns-Data over time"
				+ "-Comparisons-Relationships";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Line Graph");
				})
				.end(done);
		});

		it("should return Bar Chart as first result", function (done) {
			var querystring = "?grouped=false&functions=Comparisons-Relationships"
				+ "Patterns";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Bar Chart");
				})
				.end(done);
		});

		it("should return Bar Chart as first result", function (done) {
			var querystring = "?grouped=true&functions=Comparisons-Relationships"
				+ "Patterns-Distribution";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Bar Chart");
				})
				.end(done);
		});

		it("should return Dot Map as first result", function (done) {
			var querystring = "?grouped=true&functions=Distribution-Location" +
				"Patterns";

			request(app)
				.get(chartsPath + querystring)
				.expect(200)
				.expect(function (response) {
					logger.debug(response.body);
					assert.equal(response.body[0].chart, "Dot Map");
				})
				.end(done);
		});
	});
});
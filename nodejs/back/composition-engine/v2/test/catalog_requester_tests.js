/**
 * @author Marc Karassev
 *
 * Tests for visualization catalog requester. 
 */

var catalogRequester = require("../visualization_catalog_requester"),
	assert = require("assert"),
	async = require("async"),
	logger = require("../logger");

describe("visualization catalog requester", function () {

	it("should produce an error when the catalog is unreachable", function (done) {
		async.parallel([
			function (callback) {
				catalogRequester.getVisualizationFunctions(function (err, functions) {
					if (err) {
						assert(err.whileReachingCatalog);
						assert(!functions);
					}
					callback();
				});
			},
			function (callback) {
				catalogRequester.getCharts(function (err, functions) {
					if (err) {
						assert(err.whileReachingCatalog);
						assert(!functions);
					}
					callback();
				});
			},
			function (callback) {
				catalogRequester.getRatedCharts([], false, function (err, functions) {
					if (err) {
						assert(err.whileReachingCatalog);
						assert(!functions);
					}
					callback();
				});
			}
		], function join (err, results) {
			if (err) {
				logger.error(err);
				throw err;
			}
			done()
		});
	});
});
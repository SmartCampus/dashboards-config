/**
 * @author Quentin Cornevin & Marc Karassev
 *
 * Module responsible for querying SmartCampus' data API.
 */

var http = require("http"),
    SMARTCAMPUS_HOST = "http://smartcampus.unice.fr",
    SENSORS_PATH = "/sensors";

/**
 * Retrieves all sensors from SmartCampus.
 *
 * @param  {Function} callback function to call when job is finished with
 *                             the body response from the API call
 */
function getAllSensors(callback) {
    var url = SMARTCAMPUS_HOST + SENSORS_PATH;

    http.get(url, function(res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getAllSensors");
        });
}

/**
 * Retrieves all sensors from SmartCampus.
 *
 * @type {getAllSensors}
 */
exports.getAllSensors = getAllSensors;

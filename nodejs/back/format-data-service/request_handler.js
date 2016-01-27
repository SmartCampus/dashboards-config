/**
 * Created by Quentin on 12/1/2015.
 */
var requester = require("./api_requester"),
     processor = require("./response_processor");

/**
 * This function first treat the queries param, then make the request to the given sensor to the API with
 * {@link api_requester#getSensors}. Then the information receive is concatenate with the
 * {@link response_processor#concatenateResponse}. Finally the information is send in the response of the request.
 *
 * @param   queries         {array}         Array with all the query parameters of the request.
 * @param   response        {response}      Response of the request.
 */
function requestSensors(queries, response) {
    var stringQuery = "?";
    for(var i in queries) {
        stringQuery += i + "=" + queries[i] + "&";
    }

    requester.getSensors(stringQuery, function(res) {
    processor.concatenateResponse(response,res);
    });
}

/**
 * This function request the information of the sensor with the given {@param sensorId}, with the
 * {@link api_requester#getSensors}. Then the result in transform in a format readable by HighCharts with the method
 * {@link response_processor#highChartFormatTransformation}. Finally the result is return in the response of the
 * request.
 *
 * @param   sensorId        {string]        Id of the sensor that will be requested on the API.
 * @param   date            {string}        String representing the interval of date of when we want the information
 *                                          of the sensor.
 * @param   state           {boolean}       This boolean represent if the information will contain a state like for
 *                                          a door or a window, or a value like for a temperature.
 * @param   response        {response}      Response of the request
 */
function getSensorInformation(sensorId, date, state, response) {
    requester.getSensorData(sensorId, date, function(res) {
        processor.highChartFormatTransformation(response, res, state);
    });

}

/**
 * This function request the information for the sensor with the given {@param sensorId} in the API, with the
 * {@link getSensorData} method. Then the information is split in two list, for example one whe the door is open
 * and one for when the door is closed. Then the result is put in a JSON and return to the {@param response} of the
 * request. This function does not work with a temperature.
 *
 * @param   sensorId        {string}        Id of the sensor requested on the API.
 * @param   date            {string}        String representing the interval of date of when we want to retrieve the
 *                                          information of the sensors.
 * @param   response        {response}      Response of the request.
 */
function getStateInformationSplit(sensorId, date, response) {
    requester.getSensorData(sensorId, date, function(res) {
        processor.splitInformation(response, res);
    });
}


/**
 * This function request the information for the sensor with the given {@param sensorId} for the given interval of
 * {@param date} with the function {@link getSensorData}. Then we run through the result with the method
 * {@link informationInPercent} and return the result in percent. This method doesn't work with a sensor like the
 * temperature.
 *
 * @param   sensorId        {string}        Id of the sensor request in the API
 * @param   date            {string}        String representing the interval of date of when we want to retrieve the
 *                                          information. If there is no date, all the information are returned.
 * @param   response        {response}      Response of the request.
 */
function getInformationInPercent(sensorId, date, response) {
    requester.getSensorData(sensorId, date, function(res) {
        processor.informationInPercent(res,response, date);
    });
}


function getLastInformation(sensorId, response) {
    requester.getLastSensorData(sensorId, function(res) {
       processor.standardizeInformation(response, res);
    });
}


function getContainersChild(containerId, callback) {
    requester.getContainerChild(containerId, function (res) {
        processor.concatenateResponse(callback, res);
    });
}

function getReversedInformation(sensorId, date, callback) {
    requester.getSensorData(sensorId, date, function(response) {
        processor.reverseInformation(response, callback);
    });
}

function getSensorsEnhancedInformation(sensorName, callback) {
    requester.getEnhancedSensorsData(sensorName, function(res, err) {
        callback(res,err);
    });
}

exports.getSensorsEnhancedInformation = getSensorsEnhancedInformation;

exports.getReversedInformation = getReversedInformation;

exports.getContainersChild = getContainersChild;

exports.getLastInformation = getLastInformation;

/**
 *
 * @type {getStateInformationSplit}
 */
exports.getStateInformationSplit = getStateInformationSplit;

/**
 *
 * @type {getInformationInPercent}
 */
exports.getInformationInPercent = getInformationInPercent;

/**
 *
 * @type {getSensorInformation}
 */
exports.getSensorInformation = getSensorInformation;

/**
 *
 * @type {requestSensors}
 */
exports.requestSensors = requestSensors;
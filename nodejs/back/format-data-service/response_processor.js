/**
 * Created by Quentin on 12/1/2015.
 *
 * This module handle all the process of the data sent by smartCampus to put it in a more usefull format by the format
 * for the frontend
 *
 */
var moment = require("moment");

/**
 * This function concatenate the response received and put in a jsonin the callback.
 *
 * @param callback
 * @param res
 */
function concatenateResponse(callback, res) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end", function() {
        var json = JSON.parse(stringData);
        callback(json);
    });
}

/**
 * This function put the information send by SmartCampus to a format readable for HighChart. Which means :
 *      { data : [] }
 *
 * @param   response    {function}      Response of the method
 * @param   res         {function}      Response to the request of SmartCampus
 * @param   state       {boolean}       Boolean to check if the sensor is in the category state or not.
 */
function highChartFormatTransformation(response, res, state) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end" , function() {
        var sensorInfoJson = JSON.parse(stringData);
        var responseInGoodFormat = {"data": []};

        for(var i in sensorInfoJson.values) {
            responseInGoodFormat.data.push(handleState(state, sensorInfoJson, i));
        }
        response.send(responseInGoodFormat);
    });
}

/**
 * This function handle the case if the sensor request is a state. Which means the information "ON" is changed into
 * a 100 and a "OPEN" is changed into a 1 and "OFF" or "CLOSE" are changed into 0.
 *
 * @param   state               {string}        Value of the state sent by the sensor-container-API
 * @param   sensorInfoJson      {json}          JSON with all the information.
 * @param   i                   {int}           Iterator in the json
 * @returns sensorPerTime       {Array}         Array with all the information the good format.
 */
function handleState(state, sensorInfoJson, i) {
    var sensorPerTime = [];
    sensorPerTime.push((sensorInfoJson.values[i].date)*1000);
    if(state) {
        if(sensorInfoJson.values[i].value == 'ON') {
            sensorPerTime.push(100);
        } else if(sensorInfoJson.values[i].value == 'OPEN') {
            sensorPerTime.push(1);
        }
        else {
            sensorPerTime.push(0);
        }
    } else {
        sensorPerTime.push(parseFloat(sensorInfoJson.values[i].value));
    }
    return sensorPerTime;
}

/**
 * This method split the information in two list, the first one with all the "OPEN" and their date, and a second one
 * with all the "CLOSE". In addition, the "OPEN" are changed into 1 and the "ClOSE" into 0.
 *
 * @param   response    {function}      Response send by the function
 * @param   res         {function}      Response of the request to the sensor-containers-API
 */
function splitInformation(response, res) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end" , function() {
        var tempPerTime = JSON.parse(stringData);
        var responseInGoodFormat = splittedInformation(tempPerTime);
        response.send(responseInGoodFormat);
    });
}

/**
 * This function take a JSON in the format :
 * { values : [{value : 'CLOSE', date : 1}]}
 * then splitted in two list in the following format :
 * {data : [{open : []}, {close : [[1000, 0]]}]}
 *
 * @param       {json}              tempPerTime
 * @returns     {{data: Array}}
 */
function splittedInformation(tempPerTime) {
    var openList = [];
    var closeList = [];

    var responseInGoodFormat = {"data": []};
    for(var i in tempPerTime.values) {
        var loopArray = [];
        if(tempPerTime.values[i].value == "OPEN")  {
            loopArray.push((tempPerTime.values[i].date)*1000);
            loopArray.push(1);
            openList.push(loopArray);
        }
        else {
            loopArray.push((tempPerTime.values[i].date)*1000);
            loopArray.push(0);
            closeList.push(loopArray);
        }
    }

    responseInGoodFormat.data.push({"open" : openList});
    responseInGoodFormat.data.push({"close" : closeList});

    return responseInGoodFormat;
}



/**
 * This function put the information in percent, which means it count all the "OPEN" and the "CLOSE" and return a JSON
 * object with two JSON in it. The first one with the percent of OPEN and the second one with the percent of time it's
 * close.
 *
 * @param   res             {function}      Response of the request
 * @param   response        {function}      Response of the function
 * @param   date            {string}        Interval of date
 */
function informationInPercent(res, response, date) {
    var stringData = "";
    var dates = date.split("/")
    var begin = moment(dates[0]).unix();
    var end = moment(dates[1]).unix();

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end" , function() {
        var tempPerTime = JSON.parse(stringData);
        var responseInGoodFormat = persentFormat(tempPerTime, begin, end);
        response.send(responseInGoodFormat);
    });
}


function persentFormat(tempPerTime, begin, end) {
    var responseInGoodFormat = {"data": []};
    var totalTimeOpen = 0;
    var totalTime = end - begin;
    var lastOn = 0;

    if(tempPerTime.values.length == 0) {

    }
    for(var i in tempPerTime.values) {
        console.log(tempPerTime.values[i]);
        console.log(i);
        if(i == 0) {
            if(tempPerTime.values[i].value === "OPEN") {
                lastOn = tempPerTime.values[i].date;
            } else if (tempPerTime.values[i].value === "CLOSED") {
                lastOn = begin;
                totalTimeOpen += (tempPerTime.values[i].date - begin);
            }
        } else {
            if (tempPerTime.values[i].value === "OPEN") {
                lastOn = tempPerTime.values[i].date;
            } else if (tempPerTime.values[i].value === "CLOSED") {
                totalTimeOpen += (tempPerTime.values[i].date - lastOn);
            }
        }
    }
    console.log("Total time " + totalTime)
    console.log("Total time open : " + totalTimeOpen)
    var percent = totalTimeOpen/totalTime;

    console.log("Percent : " + percent)

    responseInGoodFormat.data.push({"open" : percent*100});
    responseInGoodFormat.data.push({"close": (1 - percent)*100});

    return responseInGoodFormat;
}

/**
 * This function change the information "OPEN"/"ON" and "CLOSE"/"OFF" in 0 and 1.
 *
 * @param   response        {function}      Response of the function
 * @param   res             {function}      Response of the request
 */
function standardizeInformation(response, res) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end", function() {
        var jsonData = JSON.parse(stringData);
        var standardizeResponse = {data: []};
        if(jsonData.values[0].value == "OPEN" || jsonData.values[0].value == "ON") {
            standardizeResponse.data.push(parseInt(jsonData.values[0].date));
            standardizeResponse.data.push(1);
        } else if(jsonData.values[0].value == "CLOSED" || jsonData.values[0].value == "OFF") {
            standardizeResponse.data.push(parseInt(jsonData.values[0].date));
            standardizeResponse.data.push(0);
        } else {
            standardizeResponse.data.push(parseInt(jsonData.values[0].date));
            standardizeResponse.data.push(jsonData.values[0].value);
        }
        response.send(standardizeResponse);
    });
}

/**
 * This function change the format of the information for the sensor of the category STATE. The value "ON" is changed
 * into 0 and the the value "OFF" into 100.
 *
 * @param   res         {function}      Response of the request made to sensor-container-API
 * @param   callback    {function}      Callback with one parameter which is the response.
 */
function reverseInformation(res, callback) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end" , function() {
        var sensorInfoJson = JSON.parse(stringData);
        var responseInGoodFormat = {"data": []};

        for(var i in sensorInfoJson.values) {
            var responsePerTime = [];
            responsePerTime.push(parseFloat(sensorInfoJson.values[i].date) * 1000);

            if(sensorInfoJson.values[i].value == "ON") {
                responsePerTime.push(0);
            } else if(sensorInfoJson.values[i].value == "OFF") {
                responsePerTime.push(100);
            }
            responseInGoodFormat.data.push(responsePerTime);
        }

        callback(responseInGoodFormat);
    });
}

/**
 * This function sort the sensor in a hierarchical order. With this, the biggest geographical container is in the
 * first one in the JSON and all his child and sensor are nested in an other JSON. This function contains a nested
 * recursive function.
 *
 * @param   sensors                 {Array}     Array with all the sensor with have to sort hierarchically
 * @param   hierarchicalSensors     {json}      Json containing the information
 * @param   callback                {function}  Function with one parameter which is the response
 */
function sortHierarchicalSensor(sensors, hierarchicalSensors, callback) {
    for(var iterator in hierarchicalSensors.childContainer) {
        recursiveClear(hierarchicalSensors.childContainer[iterator]);
    }
    function recursiveClear(container) {
        for(var iterator in container.directSensor) {
            if(sensors.indexOf(container.directSensor[iterator].name) === -1) {
                delete container.directSensor[iterator]
            }
        }

        if(container.childContainer.length > 0) {
            for(var iterator in container.childContainer) {
                recursiveClear(container.childContainer[iterator])
            }
        }
    }
    callback(hierarchicalSensors);
}

/**
 *  Exports of the function :
 */

exports.sortHierarchicalSensor = sortHierarchicalSensor;

exports.reverseInformation = reverseInformation;

exports.standardizeInformation = standardizeInformation;

exports.informationInPercent = informationInPercent;

exports.splitInformation = splitInformation;

exports.highChartFormatTransformation = highChartFormatTransformation;

exports.concatenateResponse = concatenateResponse;

exports.handleState = handleState;

exports.splittedInformation = splittedInformation;

exports.persentFormat = persentFormat;
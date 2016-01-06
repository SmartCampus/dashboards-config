/**
 * Created by Quentin on 12/1/2015.
 */
var moment = require("moment");


function concatenateResponse(response, res) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end", function() {
        var tempPerTime = JSON.parse(stringData);
        response.send(tempPerTime);
    });
}

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
        console.timeEnd("Get-specific-sensor-data")
    });
}

function handleState(state, sensorInfoJson, i) {
    var sensorPerTime = [];
    sensorPerTime.push((sensorInfoJson.values[i].date)*1000);
    if(state) {
        if(sensorInfoJson.values[i].value == 'ON') {
            sensorPerTime.push(100);
        }
        if(sensorInfoJson.values[i].value == 'OPEN') {
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

function splitInformation(response, res) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end" , function() {
        var tempPerTime = JSON.parse(stringData);
        var responseInGoodFormat = {"data": []};

        var openList = [];
        var closeList = [];

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

        response.send(responseInGoodFormat);
        console.timeEnd("Get-specific-sensor-splitList-data");
    });
}


function informationInPercent(res, response, date) {
    var stringData = "";
    var dates = date.split("/")
    var begin = moment(dates[0]).unix();
    var end = moment(dates[1]).unix();
    var totalTime = end - begin;

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    var totalTimeOpen = 0;
    res.on("end" , function() {
        var tempPerTime = JSON.parse(stringData);
        var responseInGoodFormat = {"data": []};

        var lastOn = 0;
        for(var i in tempPerTime.values) {
            if(i == 1) {
                if(tempPerTime.values[i].value == "OPEN") {
                    lastOn = tempPerTime.values[i].date;
                } else {
                    lastOn = begin;
                    totalTimeOpen += (tempPerTime.values[i].date - begin);
                }
            }
            if(tempPerTime.values[i].value == "OPEN") {
                lastOn = tempPerTime.values[i].date;
            } else if(tempPerTime.values[i].value == "OPEN") {
                totalTimeOpen += (tempPerTime.values[i].date - lastOn);
            }
        }
        var percent = totalTimeOpen/totalTime;
        responseInGoodFormat.data.push({"open" : percent*100});
        responseInGoodFormat.data.push({"close": (1 - percent)*100});

        response.send(responseInGoodFormat);
        console.timeEnd('Get-specific-sensor-percent-data');
    });
}

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
            responsePerTime.push(parseFloat(sensorInfoJson.values[i].date));

            if(sensorInfoJson.values[i].value == "ON") {
                responsePerTime.push("OFF");
            } else if(sensorInfoJson.values[i].value == "OFF") {
                responsePerTime.push("ON");
            }
            responseInGoodFormat.data.push(responsePerTime);
        }

        callback(responseInGoodFormat);
    });
}


exports.reverseInformation = reverseInformation;

exports.standardizeInformation = standardizeInformation;

exports.informationInPercent = informationInPercent;

exports.splitInformation = splitInformation;

exports.highChartFormatTransformation = highChartFormatTransformation;

exports.concatenateResponse = concatenateResponse;
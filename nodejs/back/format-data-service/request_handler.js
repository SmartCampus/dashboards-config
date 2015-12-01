/**
 * Created by Quentin on 12/1/2015.
 */
var requester = require("./api_requester"),
                 moment = require("moment");


function requestSensors(queries, response) {
    var stringQuery = "?";
    for(var i in queries) {
        stringQuery += i + "=" + queries[i] + "&";
    }

    requester.getSensors(stringQuery, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
           stringData += chunck;
        });

        res.on("end", function() {
            var tempPerTime = JSON.parse(stringData);
            response.send(tempPerTime);
        })
    });
}


function getSensorInformation(sensorId, date, state, response) {
    requester.getSensorData(sensorId, date, function(res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            var responseInGoodFormat = {"data": []};

            for(var i in tempPerTime.values) {
                var temperaturePerTime = [];
                temperaturePerTime.push((tempPerTime.values[i].date)*1000);
                if(state) {
                    if(tempPerTime.values[i].value == "ON") temperaturePerTime.push(100);
                    if(tempPerTime.values[i].value == "OPEN") temperaturePerTime.push(1);
                    else {
                        temperaturePerTime.push(0);
                    }
                } else {
                    temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
                }
                responseInGoodFormat.data.push(temperaturePerTime);
            }

            response.send(responseInGoodFormat);
        });
    });
}

function getStateInformationSplit(sensorId, date, response) {
    requester.getSensorData(sensorId, date, function(res) {
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
            //    temperaturePerTime.push((tempPerTime.values[i].date)*1000);
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
        });
    });
}

function getInformationInPercent(sensorId, date, response) {
    requester.getSensorData(sensorId, date, function(res) {
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
        });


    });
}

exports.getStateInformationSplit = getStateInformationSplit;

exports.getInformationInPercent = getInformationInPercent;

exports.getSensorInformation = getSensorInformation;

exports.requestSensors = requestSensors;
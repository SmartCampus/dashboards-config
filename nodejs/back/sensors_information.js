/**
 * @author Quentin Cornevin
 *
 * Module responsible for creating the good request to the SmartCampus API.
 */

var requestSmartcampus = require("./request_smartcampus"),
    moment = require("moment");

/**
 * This method will retrieve all the data of the smart campus API for the given office and for the
 * given interval of date. If there is no date, then it retrieves all the data.
 *
 * @param   {string}    date            Interval of date of the wished data
 * @param   {integer}   officeNumber    The number of the office where we want the data
 * @param   {response}  response        Response of the request exposed in the route
 *
 */
function getDeskTemperature(date, officeNumber, response) {
        requestSmartcampus.getSensorData("TEMP_" + officeNumber + "V", date, false, function (res) {
        var stringData = ""

        res.on("data", function(chunck) {
           stringData += chunck;
        });

        res.on("end" , function() {
            var tempPerTime = JSON.parse(stringData);
            var responseInGoodFormat = {"data": []};

            for(var i in tempPerTime.values) {
                var temperaturePerTime = [];
                temperaturePerTime.push((tempPerTime.values[i].date)*1000);
                temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
                responseInGoodFormat.data.push(temperaturePerTime);
            }

            response.send(responseInGoodFormat);
        })
    });
}

/**
 * This method will retrieve the exterior temperature of the campus for the given interval of date.
 *
 * @param   {string}    date        Interval of date where we want the data
 * @param   {response}  response    Response of the request exposed in the route
 *
 */
function getCampusTemperature(date, response) {
    requestSmartcampus.getSensorData("TEMP_CAMPUS", date, false, function (res) {
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
                temperaturePerTime.push(parseFloat(tempPerTime.values[i].value));
                responseInGoodFormat.data.push(temperaturePerTime);
            }

            response.send(responseInGoodFormat);
        })
    });
}

/**
 * not used
 * @param callback
 */
function getDoorsState(callback) {
    requestSmartcampus.getSensorData("DOOR443STATE", "", true, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });
        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            callback.send(windowState);
        });
    });
}


/**
 * This method retrieve all the data for the state of the window of the given office number
 *
 * @param   {response}  response            Response of the request exposed in the route
 * @param   {integer}   officeNumber        Office number where we want the data
 *
 */
function getWindowsState(response, officeNumber) {
    requestSmartcampus.getLastSensorData("WINDOW" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });

        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            response.send(windowState);
        });
    });
}

/**
 * This method retrieve the data with the last state of the air conditioner
 *
 * @param   {response}      response            Response of the request exposed in the route
 * @param   {integer}       officeNumber        Number of the office where we want the data
 *
 *  TODO : si on veut normaliser faudrait que le capteur soit sur /AC443 et pas /AC_443 (meme synthase que la fenetre)
 */
function getAirConditionerState(response, officeNumber) {
    requestSmartcampus.getLastSensorData("AC_" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });

        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"state" : json.values[0].value};
            response.send(windowState);
        });
    });
}

/**
 * TODO : Sprint suivant : envoie les données avec toutes les ouvertures de porte pour Salah
 *
 * @param response
 * @param officeNumber
 */
function getDoorsOpening(response, officeNumber) {
    requestSmartcampus.getLastSensorData("DOOR" + officeNumber + "STATE", false, function (res) {
        var stringData = "";

        res.on("data", function (chunck) {
            stringData += chunck;
        });

        res.on("end", function () {
            var json = JSON.parse(stringData);
            var windowState = {"data" : json.values[0].value};
            response.send(windowState);
        });
    });
}

/**
 * This method retrieves all the opening of the door of the given office number per day and put it
 * in the response of the request exposed in the route.
 *
 * @param   {response}  response        Response of the request in the route
 * @param   {int}   officeNumber    Number of the office where we want to retrieve the opening
 *                                      of the window
 * @param   {string}    date            Intervale of date when we want to retrive the data
 *
 */
function getWindowOpening(response, officeNumber, date) {
    requestSmartcampus.getSensorData("WINDOW" + officeNumber+ "STATE", date, false, function (res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end" , function() {
            var json = JSON.parse(stringData);
            var windowsOpening = {"data" : []};

            var hashMap = {};
            for(var i in json.values) {
                if(json.values[i].value == "OPEN") {
                    var date = moment.unix(json.values[i].date);
                    var day = date.dayOfYear();
                    if(hashMap[day] == undefined) {
                        hashMap[day] = 1;
                    } else {
                        hashMap[day] = hashMap[day] + 1;
                    }
                }
            }
            for(var test in hashMap) {
                var table = [];
                table.push(parseInt(test));
                table.push(hashMap[test]);
                windowsOpening.data.push(table);
            }

            response.send(windowsOpening);
        })
    });
}

/**
 * This method will calculate the per centage of time when the air conditioner is used and put it
 * in the response of the request.
 *
 * @param   [response}  response        Response of the request expose in the route
 * @param   {string}    officeNumber    Number of the office where we want to check the air conditioner
 * @param   {string}    date            Intervale of date when we want to get the data
 */
function getAirConditioningUsage(response, officeNumber, date) {
    requestSmartcampus.getSensorData("AC_" + officeNumber+ "STATE", date, false, function (res) {
        var stringData = "";

        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end" , function() {
            var json = JSON.parse(stringData);
            var airConditionerOpening = {"data" : []};
            var hashMap = {};
            var isOn = true;
            for(var i in json.values) {
                var date = moment.unix(json.values[i].date);
                var day = date.dayOfYear();
                var hour = date.hour();
                if(hashMap[day] == undefined) {
                    if(json.values[i].value == "ON") {
                        hashMap[day] = 24 - hour;
                    } else {
                        isOn = false;
                        hashMap[day] = hour;
                    }
                } else {
                    if((json.values[i].value == "ON") && (isOn == false)) {
                        hashMap[day] = hashMap[day] + 24 - hour;
                        isOn = true;
                    } else if((json.values[i].value == "OFF") && (isOn == true)) {
                        hashMap[day] = hashMap[day] - (24 - hour);
                        isOn = false;
                    }
                }
            }
            for(var iterator in hashMap) {
                var table = [];
                table.push(parseInt(iterator));
                table.push((hashMap[iterator]/24*100));
                airConditionerOpening.data.push(table);
            }
            response.send(airConditionerOpening);
        })
    });
}




/**
 * This method will retrives the per cent of time when the air conditioner is used
 *
 * @type {getAirConditionningUsage}
 */
exports.getAirConditioningUsage = getAirConditioningUsage;

/**
 * This method put the number of doors opening for the given office per day.
 *
 * @type {getWindowOpening}
 */
exports.getWindowOpening = getWindowOpening;

/**
 * This method put the last state of air conditioner in the response in the route
 *
 * @type {getAirConditionerState}
 */
exports.getAirConditionerState = getAirConditionerState;

/**
 * This method put all the temperature for the interval of given date in the response in the route
 *
 * @type {getDeskTemperature}
 */
exports.getDeskTemperature = getDeskTemperature;

/**
 * This method put the last state of the window of the given office in the response in the route
 *
 * @type {getWindowsState}
 */
exports.getWindowsState = getWindowsState;

/**
 * This method put all the temperature for the interval of given date in the response in the route
 *
 * @type {getCampusTemperature}
 */
exports.getCampusTemperature = getCampusTemperature;
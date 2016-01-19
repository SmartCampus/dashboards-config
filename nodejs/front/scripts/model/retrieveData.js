/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    return { //exposed to public
        askForSeries: function (sensor, beginDate, endDate, successCB, failCB, sensorInfo, index) {
            $.get(mainServer+sensorAPI + sensor, {date: beginDate+"/"+endDate})
                .done(function (data) {
                    successCB(data, sensorInfo, index);
                })
                .fail(function (data) {
                    console.log(data);
                    failCB();
                })
                .always(function (data) {
                    console.log('For route '+ mainServer+sensorAPI + sensor + ' : \nbegin : ' + beginDate + '\nend : '+endDate);
                });
        },
        askForSeriesWithParam: function(sensor, param, beginDate, endDate, successCB, errorCB, sensorInfo, index) {
            $.get(mainServer+sensorAPI + sensor, {state:param, date: beginDate+"/"+endDate})
                .done(function (data) {
                    successCB(data, sensorInfo, index);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB();
                })
                .always(function (data) {
                    console.log('For route '+mainServer+ sensorAPI + sensor + ' : \n state : '+ param +'\nbegin : ' + beginDate + '\nend : '+endDate);
                });
        },
        askForStateNow: function (route, successStateCB, errorCB, sensorInfo, index) {
            $.get(mainServer+sensorAPI + route+'/data/last')
                .done(function (data) {
                    successStateCB(data, sensorInfo, index);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB();
                })
                .always(function (data) {
                    console.log('route sent : ', mainServer+sensorAPI + route);
                });
        }
    }
}());
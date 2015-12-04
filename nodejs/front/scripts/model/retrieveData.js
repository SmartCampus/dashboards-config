/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    return { //exposed to public
        askForSeries: function (sensor, beginDate, endDate, successCB, failCB) {
            console.log('before the get temperature for a timespan');
            $.get(sensorAPI + sensor, {date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('got temps for a timespan');
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get temp for timespan');
                    failCB();
                })
                .always(function (data) {
                    console.log('processed series');
                    console.log('For route '+ sensorAPI + sensor + ' : \nbegin : ' + beginDate + '\nend : '+endDate);
                });
            console.log('after the get');
        },
        askForSeriesWithParam: function(sensor, param, beginDate, endDate, successCB) {
            $.get(sensorAPI + sensor, {state:param, date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('got temps for a timespan');
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get temp for timespan');
                })
                .always(function (data) {
                    console.log('processed series');
                    console.log('For route '+ sensorAPI + sensor + ' : \n state : '+ param +'\nbegin : ' + beginDate + '\nend : '+endDate);
                });
            console.log('after the get');
        },
        askForStateNow: function (route, successStateCB, errorCB) {
            console.log('before the get state');
            $.get(sensorAPI + route+'/data/last')
                .done(function (data) {
                    console.log('got state');
                    console.log(data);
                    successStateCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB();
                    console.log('error in state');
                })
                .always(function (data) {
                    console.log('route sent : ', sensorAPI + route);
                });
            console.log('after the get');
        }
    }
}());
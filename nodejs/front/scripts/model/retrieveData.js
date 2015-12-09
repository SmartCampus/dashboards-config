/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    return { //exposed to public
        askForSeries: function (sensor, beginDate, endDate, successCB, failCB) {
            $.get(sensorAPI + sensor, {date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('got series for a timespan');
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get series for timespan');
                    failCB();
                })
                .always(function (data) {
                    console.log('For route '+ sensorAPI + sensor + ' : \nbegin : ' + beginDate + '\nend : '+endDate);
                });
        },
        askForSeriesWithParam: function(sensor, param, beginDate, endDate, successCB, errorCB) {
            $.get(sensorAPI + sensor, {state:param, date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('got series for a timespan with param');
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get series for timespan with param');
                    errorCB();
                })
                .always(function (data) {
                    console.log('For route '+ sensorAPI + sensor + ' : \n state : '+ param +'\nbegin : ' + beginDate + '\nend : '+endDate);
                });
        },
        askForStateNow: function (route, successStateCB, errorCB) {
            $.get(sensorAPI + route+'/data/last')
                .done(function (data) {
                    console.log('got state');
              //      console.log(data);
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
        }
    }
}());
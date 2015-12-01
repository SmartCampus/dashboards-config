/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    return { //exposed to public
        askForSeries: function (sensor, beginDate, endDate, successCB) {
            console.log('before the get temperature for a timespan');
            console.log('For route '+ sensorAPI + sensor+'/data' + ' : \nbegin : ' + beginDate + '\nend : '+endDate);
            $.get(sensorAPI + sensor+'/data', {date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('got temps for a timespan');
                    //alert("Data Loaded: " + data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get temp for timespan');
                    //alert("error");
                })
                .always(function (data) {
                    console.log('processed series');
                    //alert("finished");
                });
            console.log('after the get');
        },
        askForSeriesForever: function (route, successCB) {
            $.get(sensorAPI + route+'/data')
                .done(function (data) {
                    console.log('got temps forever');
                  //  alert("Data Loaded: " + data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get temp forever');
                //    alert("error");
                })
                .always(function (data) {
                    console.log('route sent : ', sensorAPI + route+'/data');
              //      alert("finished");
                });
            console.log('after the get');
        },
        askForStateNow: function (route, successStateCB) {
            console.log('before the get window state');

            $.get(serverURL + route)
                .done(function (data) {
                    console.log('got window state');
                    console.log(data);
            //          alert("Data Loaded: " + data);
                    successStateCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in window state');
       //             alert("error");
                })
                .always(function (data) {
                    console.log(serverURL+route);
                    console.log('processed');
         //           alert("finished");
                });
            console.log('after the get');
        }
    }
}());
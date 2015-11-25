/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    return { //exposed to public
        askForTemp: function (route, beginDate, endDate, successCB) {
            console.log('before the get temperature for a timespan');
            console.log('For route '+ route + ' : \nbegin : ' + beginDate + '\nend : '+endDate);
            $.get(serverURL + route, {date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('got temps for a timespan');
                  //  alert("Data Loaded: " + data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in get temp for timespan');
                    //alert("error");
                })
                .always(function (data) {
                    console.log('processed');
                    //alert("finished");
                });
            console.log('after the get');
        },
        askForStateNow: function (route, successStateCB) {
            console.log('before the get window state');

            $.get(serverURL + route)
                .done(function (data) {
                    console.log('got window state');
                    console.log(data);
               //       alert("Data Loaded: " + data);
                    successStateCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    console.log('error in window state');
                 //   alert("error");
                })
                .always(function (data) {
                    console.log('processed');
                   // alert("finished");
                });
            console.log('after the get');
        }
    }
}());
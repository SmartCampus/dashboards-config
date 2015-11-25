/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    var tempData = {timeFrame: [], tempAsked:[]};
    return { //exposed to public
        askForTemp: function (/*params of temperature:begindate, place(office nb or out)*/) {
            console.log('before the get');

            $.get(serverURL + 'office/443/temperature', {date: "2015-10-14 8:00:11/2015-10-20 18:00:11"})
                .done(function (data) {
                    console.log('done');
                    console.log(data);
                    alert("Data Loaded: " + data);
                    tempData.tempAsked.push(data.temperatures);
                    tempData.timeFrame.push(data.time);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);

                    console.log('error');
                    alert("error");
                })
                .always(function (data) {
                    console.log('processed');
                    alert("finished");
                });
            console.log('after the get');
            return tempData;
        }
    }
}());
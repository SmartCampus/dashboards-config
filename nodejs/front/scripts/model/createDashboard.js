/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    var tempAsked = [];
    var timeFrame = [];
    return { //exposed to public
        getTemp: function (/*params of temperature:begindate, place(office nb or out)*/) {
            console.log('before the get');

            $.get(serverURL + 'office/443/temperature', {date: "2015-10-14 18:00:11/2015-10-14 19:00:11"})
                .done(function (data) {
                    console.log('done');
                    console.log(data);
                    alert("Data Loaded: " + data);
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
        }
    }
}());
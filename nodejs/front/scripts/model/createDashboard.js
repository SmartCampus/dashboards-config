/**
 * Created by Garance on 25/11/2015.
 */
var retrieveData = (function () {
    return { //exposed to public
        askForTemp: function (route, beginDate, endDate) {
            console.log('before the get');

            $.get(serverURL + route, {date: beginDate+"/"+endDate})
                .done(function (data) {
                    console.log('done');
                    console.log(data);
                    alert("Data Loaded: " + data);
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
        }
    }
}());
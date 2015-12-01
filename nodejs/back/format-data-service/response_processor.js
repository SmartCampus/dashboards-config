/**
 * Created by Quentin on 12/1/2015.
 */


function concatenateResponse(response, res) {
    var stringData = "";

    res.on("data", function(chunck) {
        stringData += chunck;
    });

    res.on("end", function() {
        var tempPerTime = JSON.parse(stringData);
        response.send(tempPerTime);
    });
}




exports.concatenateResponse = concatenateResponse;
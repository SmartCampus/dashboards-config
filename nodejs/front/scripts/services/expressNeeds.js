/**
 * Created by Garance on 07/01/2016.
 */
var expression = (function () {
    return { //exposed to public
        need: function (needsObject, successCB, errorCB) {//{sensors:[]}
            $.post(needsServer + needsQuestion, needsObject)
                .done(function (data) {
                    successCB(data);
                })
                .fail(function (data) {
                    errorCB();
                });
        },

        compose: function (needsList, sensorsList, successCB, errorCB) {
            $.post(needsServer + composition, {
                    needs: needsList,
                    sensors: sensorsList
                })
                .done(function (data) {
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB(data);
                });

        }
    }
}());
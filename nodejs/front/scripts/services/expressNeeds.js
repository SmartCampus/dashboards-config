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
        needList: function (needsList, successCB, errorCB) {
            $.post(needsServer + needSet, {
                    needs: needsList
                })
                .done(function (data) {
                    if (data.length <= 0) {
                        console.log('no more sensors possible. must do stg');
                        errorCB(data);
                    }
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB(data);
                });
        },
        sensorList: function (sensorsList, successCB, errorCB) {
            $.post(needsServer + sensorSet, {
                    sensors: sensorsList
                })
                .done(function (data) {
                    if (data.length <= 0) {
                        console.log('no more needs possible. Must do stg. ');
                        errorCB(data);
                    }
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB(data);
                });
        },
        compose: function (needsList, sensorsList, successCB, errorCB) {
            console.log(needsList);
            console.log(sensorsList);
            $.post(needsServer + composition, {
                    needs: needsList,
                    sensors: sensorsList
                })
                .done(function (data) {
                    console.log('********************');
                    console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB(data);
                });

        }
        //POST sur needSet
    }
}());
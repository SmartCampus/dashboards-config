/**
 * Created by Garance on 07/01/2016.
 */
var expression = (function () {
    return { //exposed to public
        need: function (needsObject, successCB, errorCB) {
            $.post(needsServer + needsQuestion, needsObject)
                .done(function (data) {
                    console.log('request done !');
                    successCB(data);
                })
                .fail(function (data) {
                    console.log('error in post needs expression');
                    errorCB();
                });
        },
        needList: function(needsList, successCB, errorCB) {
            $.post(needsServer + needSet, needsList)
                .done(function (data) {
                    console.log('request done ! All the sensors left you can use : ');
                    if (data.length <= 0) {
                        console.log('liste vide');
                    }
                    console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log('error in post ');
                    console.log(data);
                    errorCB(data);
                });
        }
        //POST sur needSet
    }
}());
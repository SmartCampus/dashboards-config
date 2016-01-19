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
                    console.log('error in post gen');
                    errorCB();
                });
        }
    }
}());
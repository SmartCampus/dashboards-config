/**
 * Created by Garance on 07/01/2016.
 */
var expression = (function () {
    return { //exposed to public
        need: function (needsObject, successCB, errorCB) {
        /*    $.post(needsServer + needsQuestion,
                {
                    job: "generateBoolean",
                    config: {
                        id: idWanted,
                        position: position,
                        boolName: name
                    }
                })
                .done(function (data) {
                    console.log('request done !');
                    // console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log('error in post gen');
                    errorCB();
                });
    */
            console.log(needsObject);
            successCB('ok')
        }
    }
}());
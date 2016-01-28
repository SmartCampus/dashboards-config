/**
 * Created by Garance on 05/01/2016.
 */

var layouts = (function () {
    return { //exposed to public
        newLayout: function(layoutName, successCB, errorCB) {
            $.post(genServer+widgetGen,
                {
                    job : "generateLayout",
                    config :
                    {
                        layoutType: layoutName
                    }
                })
                .done(function (data) {
                    successCB(layoutName, data);
                })
                .fail(function (data) {
                    console.log('error in post gen layout');
                    errorCB();
                });
            //successCB(halfnhalfLayout);
        },
        widgetsIds: function(layoutNeeded, successCB, errorCB) {
            //http://localhost:8083/threeThirds/widgetList
            $.get(genServer + layoutNeeded + '/widgetList')
                .done(function (data) {
                    successCB(data);
                })
                .fail(function (data) {
                    console.log(data);
                    errorCB();
                })
        }

    }
}());
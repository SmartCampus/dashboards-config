/**
 * Created by Garance on 05/01/2016.
 */

var layouts = (function () {
    return { //exposed to public
        newLayout: function(layoutName, widgetsArray, successCB, errorCB) {
            console.log('you want ', layoutName);
            $.post(genServer+widgetGen,
                {
                    job : "generateLayout",
                    config :
                    {
                        layoutType: layoutName,
                        widgets: widgetsArray

                    }
                })
                .done(function (data) {
                    successCB(layoutName, data);
                })
                .fail(function (data) {
                    console.log('error in post gen layout');
                    console.log(data);
                    errorCB();
                });
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
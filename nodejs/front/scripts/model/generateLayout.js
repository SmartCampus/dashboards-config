/**
 * Created by Garance on 05/01/2016.
 */
    var halfnhalfLayout = '<div class="row">    <div id="left1" class="col-md-6 text-center"></div>    <div id="right1" class="col-md-6 text-center"></div>    </div>    <div class="row">    <div class="col-md-6" id="left2" style="height: 400px; min-width: 310px"></div>    <div class="col-md-6" id="right2" style="height: 400px; min-width: 310px"></div>   </div> ';

var layouts = (function () {
    return { //exposed to public
        newLayout: function(layoutName, successCB, errorCB) {
            /*$.post(genServer+layoutGen,
                {
                    job : "generateLayout",
                    config :
                    {
                        layoutType: layoutName,
                    }
                })
                .done(function (data) {
                    console.log('layout request done !');
                    // console.log(data);
                    successCB(data);
                })
                .fail(function (data) {
                    console.log('error in post gen layout');
                    errorCB();
                }); */
            successCB(halfnhalfLayout);
        }

    }
}());
/**
 * Created by Garance on 05/01/2016.
 */

var layoutWanted = "halfNHalf";

var setLayoutWanted = function(layoutName) {
    layoutWanted = layoutName;
};

$("button").click(function(){
    var id = this.id;

    $( "#add-content" ).empty(); // clean DOM

    if(id == 0){
        divideInTwoEgal();
    }else if(id == 1){
        divideInTwoThirds();
    }else if(id == 2){
        divideInThreeEgal();
    }/*else{
       divideInThreeNotEgal();
    }*/
});


function divideInTwoEgal() {
    var content = "<div class=\"row\">"+
        "<div class=\"col-md-6\" style=\"min-height: 500px; background-color: rgba(207, 134, 126, 0.55);\">One half</div>"+
        "<div class=\"col-md-6\" style=\"min-height: 500px; background-color: rgba(102, 175, 233, 0.55);\">One half</div>"+
        "</div>";
    $("#add-content").append(content);
}

function divideInTwoThirds() {
    var content = "<div class=\"row\">"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: rgba(207, 134, 126, 0.55);\">One third</div>"+
        "<div class=\"col-md-8\" style=\"min-height: 500px; background-color: rgba(102, 175, 233, 0.55);\">Two thirds</div>"+
        "</div>";
    $("#add-content").append(content);
}

function divideInThreeEgal() {

    var content = "<div class=\"row\">"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: rgba(207, 134, 126, 0.55);\">One third</div>"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: rgba(102, 175, 233, 0.55);\">One third</div>"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: rgba(112, 215, 0, 0.56);\">One third</div>"+
        "</div>";
    $("#add-content").append(content);
}

/*function divideInThreeNotEgal() {

    var content = "<div class=\"row\">"+
        "<div class=\"col-md-3\" style=\"min-height: 500px; background-color: rgba(207, 134, 126, 0.55) ;\">One third</div>"+
        "<div class=\"col-md-6\" style=\"min-height: 500px; background-color: rgba(102, 175, 233, 0.55);\">Two thirds</div>"+
        "<div class=\"col-md-3\" style=\"min-height: 500px; background-color: rgba(112, 215, 0, 0.56);\">One third</div>"+
        "</div>";
    $("#add-content").append(content);
}*/
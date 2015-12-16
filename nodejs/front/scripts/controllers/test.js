/**
 * Created by salahbennour on 16/12/2015.
 */

$("button").click(function(){
    var id = this.id;

    $( "#add-content" ).empty(); // clean DOM

    if(id == 0){
        divideInTwoEgal();
    }else if(id == 1){
        divideInTwoNotEgal();
    }else if(id == 2){
        divideInThreeEgal();
    }else{
        divideInThreeNotEgal();
    }
});


function divideInTwoEgal() {
    var content = "<div class=\"row\">"+
        "<div class=\"col-md-6\" style=\"min-height: 500px; background-color: #cf867e;\">.col-md-6</div>"+
        "<div class=\"col-md-6\" style=\"min-height: 500px; background-color: #66afe9;\">.col-md-6</div>"+
        "</div>";
    $("#add-content").append(content);
}

function divideInTwoNotEgal() {
    var content = "<div class=\"row\">"+
        "<div class=\"col-md-8\" style=\"min-height: 500px; background-color: #cf867e;\">.col-md-8</div>"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: #66afe9;\">.col-md-4</div>"+
        "</div>";
    $("#add-content").append(content);
}

function divideInThreeEgal() {

    var content = "<div class=\"row\">"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: #cf867e;\">.col-md-4</div>"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: #66afe9;\">.col-md-4</div>"+
        "<div class=\"col-md-4\" style=\"min-height: 500px; background-color: #000000;\">.col-md-4</div>"+
        "</div>";
    $("#add-content").append(content);
}

function divideInThreeNotEgal() {

    var content = "<div class=\"row\">"+
        "<div class=\"col-md-3\" style=\"min-height: 500px; background-color: #cf867e;\">.col-md-4</div>"+
        "<div class=\"col-md-6\" style=\"min-height: 500px; background-color: #66afe9;\">.col-md-4</div>"+
        "<div class=\"col-md-3\" style=\"min-height: 500px; background-color: #000000;\">.col-md-4</div>"+
        "</div>";
    $("#add-content").append(content);
}
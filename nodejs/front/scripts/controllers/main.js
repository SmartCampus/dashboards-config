var capteurs,
    position,
    buildings;

var previous = [];

(function getSensors(callback){
    $.get("http://localhost:8082/container/Root/child")
        .done(function (data) {
            capteurs = data;
            callback();
        });
})(init);

function init() {
    position  = capteurs;
    buildings = capteurs.childContainer;
    previous.push(position);
    explore();
}

function explore() {
    clean();
    var myContent;

    myContent = "<div class=\"row\"><h3>"+position.name+"</h3></div>";
    $("#add-it").append(myContent);

    for(var i = 0; i < buildings.length; i++){
        myContent = "<div class=\"row\"><a class=\"node\" id=\""+i+"\">"+buildings[i].name+"</a></div>";
        $("#add-it").append(myContent);
    }

    if (position.directSensor != null) {
        for(var i = 0; i < position.directSensor.length; i++){
            myContent = "<div class=\"row\"><div class=\"draggable\"><p>"+position.directSensor[i]+"</p></div></div>";
            $("#add-it").append(myContent);
            $(".draggable").draggable({
                helper: 'clone',
                revert: "invalid"
            });
        }
    }
}

function clean() {
    $( "#add-it" ).empty();
}


/** click on node **/
$(document).on('click', '.node', function(el) {

    previous.push(position);
    position = buildings[parseInt(el.target.id)];
    buildings = position.childContainer;
    explore();
});

/** click on back **/
$( "#goback" ).click(function() {
    if(previous.length > 0){
        position = previous.pop();
        buildings = position.childContainer;
        explore();
    }
});

$(".draggable").draggable({
    helper: 'clone',
    revert: "invalid"
});

$('.droppable').droppable({
    drop: dropIt
});

function dropIt(event, ui) {
    var draggableId = ui.draggable.attr("id");
    var droppableId = $(this).attr("id");

    ui.draggable.clone().appendTo($(this));
}
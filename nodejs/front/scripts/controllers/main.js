var capteurs,
    position,
    buildings;

var previous = [];

var dashs = [];


(function getSensors(callback){
    $.get(mainServer+"container/Root/child")
        .done(function (data) {
            capteurs = data;
            callback();
        });
})(init);

function init() {

    dashs[0] = new Array();
    dashs[1] = new Array();
    dashs[2] = new Array();

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
            myContent = "<div class=\"row\"><div class=\"draggable\" id=\""+position.directSensor[i]+"\"><p>"+position.directSensor[i]+"</p></div></div>";
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

    if(!alreadyInContainer(draggableId, droppableId)){
        addToDashs(draggableId, droppableId);
        ui.draggable.clone().appendTo($(this));
    }
}

function alreadyInContainer(drag, drop)
{
    return ($.inArray(drag, dashs[drop]) > -1);
}

function addToDashs(drag, drop) {
    dashs[drop].push(drag);
}


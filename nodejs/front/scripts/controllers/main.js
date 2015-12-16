var capteurs,
    position,
    buildings;

var previous = [],
    dashs = [],
    need = ["Comparison", "Hirarchy", "Proportion", "Other"];


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
    addTableRow();
    needs();
    explore();
}

function addTableRow() {

    for( var i = 0 ; i < 3 ; i++ ){
        $("#add-rows").append(
            "<div class=\"droppable\" id=\""+i+"\" style=\"min-height: 70px; border: solid; margin-top: 30px\"></div>"
        );
        $( ".droppable" ).droppable({
            drop: dropIt
        });
    }
}

function needs() {

    for(var i = 0; i < need.length; i++){
        $("#add-need").append(
            "<div class=\"row\" style=\"padding: 20px 0 0 0\"><div class=\"draggable\" id=\""+need[i]+"\"><p>"+need[i]+"</p></div></div>"
        );

        $(".draggable").draggable({
            helper: 'clone',
            revert: "invalid"
        });
    }

}


function explore() {

    $( "#add-captors" ).empty(); // clean DOM

    $("#add-captors").append(
        "<div class=\"row\"><h3>"+position.name+"</h3></div>"
    );

    for(var i = 0; i < buildings.length; i++){
        $("#add-captors").append(
            "<div class=\"row\"><a class=\"node\" id=\""+i+"\">"+buildings[i].name+"</a></div>"
        );
    }

    if (position.directSensor != null) {
        for(var i = 0; i < position.directSensor.length; i++){
            $("#add-captors").append(
                "<div class=\"row\"><div class=\"draggable\" id=\""+position.directSensor[i]+"\"><p>"+position.directSensor[i]+"</p></div></div>"
            );
            $(".draggable").draggable({
                helper: 'clone',
                revert: "invalid"
            });
        }
    }
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

    /**
    for(var i=0; i < dashs.length; i++){
        console.log("Dashboard "+i +" :");
        for(var j; j < dashs[i].length; j++){
            console.log("\t"+dashs[i][j]);
        }
    }
    **/
});

// elements which are draggable
$( ".draggable" ).draggable({
    helper: 'clone',
    revert: "invalid"
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
    return ( $.inArray( drag, dashs[drop] ) > -1 );
}

function addToDashs(drag, drop) {
    dashs[drop].push(drag);
    displayGenerateButton();
}

function displayGenerateButton(){
    for( var i = 0 ; i < dashs.length ; i++ ) {
        if ( dashs[i].length > 1 ) {
            $( "#generateButton" ).show( 700 );
            break;
        }
    }
}

function getDashboardsToGenerate(){
    return dashs;
}


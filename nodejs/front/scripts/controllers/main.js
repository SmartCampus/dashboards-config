var sensors; //This array contains all the sensors we have
//these are the visualization intentions we know of and use. Should be part of Ivan's work.
var needs = ["Comparison", "See status", "Overtime", "Summarize", "Hierarchy", "Proportion"];
var maxOfWidgets = 4; //this determines how many boxes are drawn in the center of the page
var composition_sensors = [];
var composition_needs = [];
var navbar = [];

/**
 * Get all buildings sensors et placements
 */
(function getSensors(callback) {
    $.get(mainServer + "container/Root/child")
        .done(function (data) {
            sensors = data;
            //needs = data;
            callback();
        });
})(initWindowsData);

var allTheNeeds = [];
/***********************************
 ******* Init window data *********
 * This method fills the 3 panels of the page : the needs, the widget boxes, and the sensors.
 * It also instantiates the variables we need
 ***********************************/
function initWindowsData() {

    for (var i = 0; i < maxOfWidgets; i++) {
        allTheNeeds[i] = {"needs":[], "sensors":[], "graphType":""};
        composition_needs[i] = new Array();
        composition_sensors[i] = new Array();
    }

    position = sensors;
    buildings = sensors.childContainer;
    previous.push(position);

    navbar.push(position.name);

    addTableRow();
    addNeeds();
    navigation();
}


/**
 * This adds a row to the middle panel, with the widgets.
 * For each, we also add a "delete" button, to remove all it contains if the user made a mistake
 */
function addTableRow() {

    for (var i = 0; i < maxOfWidgets; i++) {
        $("#add-rows").append('<div class="well col-md-10"><div class="droppable" id="'
            + i
            + '" style="min-height: 40px;"></div></div>'
            + '<div class="col-md-2"> <br/>'
            + '<div class="btn btn-default" onclick="deleteWidgetContent('+i+')"><span class="glyphicon glyphicon-trash">'
            + '</span></div></div>');

        $(".droppable").droppable({drop: dropIt});
    }
}

/*
This functions empties a widget box, making it back to its original state
 */
function deleteWidgetContent(widgetId) {
    composition_needs[widgetId] = [];
    composition_sensors[widgetId] = [];
    allTheNeeds[widgetId] = {"needs":[], "sensors":[], "graphType":""};
    $('#'+widgetId).empty();
    //empty()
}


/**
 * This function fills the visulization needs panel, and set its elements to being draggable elements
 */
function addNeeds() {
    for (var i = 0; i < needs.length; i++) {
        $("#add-need").append(
            "<div style=\"padding: 20px 0 0 0; text-align : center\"><span style=\"cursor : pointer;\" class=\"draggable\" id=\"" + needs[i] + "\">" + needs[i] + "</span></div>"
        );

        $(".draggable").draggable({
            helper: 'clone',
            revert: "invalid"
        });
    }
}


/***********************************
 **** WHERE part : navigation ******
 ***********************************/

var position;
var buildings;
var previous = [];


/*
This method fills the navigation panel. It makes the sensors draggable as well, but not the places.
 */
function navigation() {

    // clean DOM
    $("#add-captors").empty();


    $("#add-captors").append("<div class=\"row\"><h3>" + position.name + "</h3></div>");

    for (var i = 0; i < buildings.length; i++) {
        $("#add-captors").append(
            "<div class=\"row\"><a class=\"node\" id=\"" + i + "\">" + buildings[i].name + "</a></div>"
        );
    }

    if (position.directSensor != null) {

        for (var i = 0; i < position.directSensor.length; i++) {
            $("#add-captors").append(
                "<div class=\"row\"><span class=\"draggable\" id=\"" + position.directSensor[i] + "\" style=\"cursor : pointer;\">" + position.directSensor[i] + "</span></div>"
            );

            $(".draggable").draggable({
                helper: 'clone',
                revert: "invalid",
                cursor: "pointer"
            });
        }
    }

    updateNavigation();
}

function updateNavigation(){
    // clean DOM
    $(".breadcrumb").empty();

    for(var i = 0; i < navbar.length; i++){
        $(".breadcrumb").append("<li><a class=\"nave\" name=\""+navbar[i]+"\">"+navbar[i]+"</a></li>");
    }
}

//TODO: doc entre cette méthode & la suivante ?
// click on building
$(document).on('click', '.nave', function (el) {

    var myelement = el.target.name;
    var navBar_copy = navbar;
    for(var i = navBar_copy.length-1; i > 0; i--) {
        if (myelement != navBar_copy[i]) {
            navbar.pop();
            position = previous.pop();
            buildings = position.childContainer;
            navigation();
        }else{
            break;
        }
    }
});

// click on building
$(document).on('click', '.node', function (el) {

    previous.push(position);
    position = buildings[parseInt(el.target.id)];
    buildings = position.childContainer;
    navbar.push(position.name);

    navigation();
});

//The composition starts as empty. Max is as many as the widget number.



/************************
 **** DROP ELEMENT ******
 * Sets a dragged element into the widget box
 * Add this element to the widget description array, to prepare for generation
 ***********************/
function dropIt(event, ui) {

    var draggableName = ui.draggable.attr("id");
    var droppableId = $(this).attr("id");

    //This is if we talk about a visualization need
    //It must exist, and it mustn't already be in the widget
    if ($.inArray(draggableName, needs) > -1) {
        if (!($.inArray(draggableName, composition_needs[droppableId]) > -1)) {
            composition_needs[droppableId].push(draggableName);
            ui.draggable.clone().appendTo($(this));
            allTheNeeds[droppableId].needs.push(draggableName);
        }
    } else {
        //the sensor mustn't already be in the widget
        if (!($.inArray(draggableName, composition_sensors[droppableId]) > -1)) {
            composition_sensors[droppableId].push(draggableName);
            ui.draggable.clone().appendTo($(this));
            allTheNeeds[droppableId].sensors.push(draggableName);
        }
    }

    displayGenerateButton();
}


var displayGenerateButton = function() {
    for (var i = 0; i < composition_sensors.length; i++) {
        if (composition_sensors[i].length > 1) {
            $("#generateButton").show(700);
            break;
        }
    }
};


/*******************************
 **** JSON Of composition ******
 ******************************/

var declareNeeds = function () {
    allTheNeeds.forEach(function (oneNeed, index) {
        console.log(oneNeed);
        expression.need(oneNeed, function (answer) {
            console.log(answer);
            oneNeed.graphType = answer;
            //If this is our last callback, set the whole result in local storage.
            //Better than cookie bc same behaviour throughout browsers.
         //   if (index >= allTheNeeds.length) {
                localStorage.setItem("bar", JSON.stringify(allTheNeeds));
           // }
        }, cantDo);
    });
};
var cantDo = function() {
    //TODO: modale qui explique que c'est pas possible
    console.log('IT\'S IMPOSSIBRRRRUUUUU');
};
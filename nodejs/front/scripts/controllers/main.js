var sensors;
var needs = ["Comparison", "See status", "Overtime", "Summarize", "Hierarchy", "Proportion"];
var maxOfWidgets = 4;
var composition_sensors = [];
var composition_needs = [];
var navbar = [];

/**
 * Get all buildings captors et placements
 */
(function getSensors(callback) {
    $.get(mainServer + "container/Root/child")
        .done(function (data) {
            sensors = data;
            //needs = data;
            callback();
        });
})(initWindowsData);


/***********************************
 ******* Init window data *********
 ***********************************/

function initWindowsData() {

    for (var i = 0; i < maxOfWidgets; i++) {
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


function addTableRow() {

    for (var i = 0; i < maxOfWidgets; i++) {
        $("#add-rows").append("<div class=\"well\"><div class=\"droppable\" id=\"" + i + "\" style=\"min-height: 40px;\"></div></div>");

        $(".droppable").droppable({drop: dropIt});
    }
}



function addNeeds() {

    for (var i = 0; i < needs.length; i++) {
        $("#add-need").append(
            "<div style=\"padding: 20px 0 0 0; text-align : center\"><span style=\"cursor : pointer; display : block\" class=\"draggable\" id=\"" + needs[i] + "\">" + needs[i] + "</span></div>"
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
                "<div class=\"row\"><span class=\"draggable\" id=\"" + position.directSensor[i] + "\" style=\"cursor : pointer;  display : block\">" + position.directSensor[i] + "</span></div>"
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



/************************
 **** DROP ELEMENT ******
 ***********************/
function dropIt(event, ui) {

    var draggableId = ui.draggable.attr("id");
    var droppableId = $(this).attr("id");

    if ($.inArray(draggableId, needs) > -1) {
        if (!($.inArray(draggableId, composition_needs[droppableId]) > -1)) {
            composition_needs[droppableId].push(draggableId);
            ui.draggable.clone().appendTo($(this));
        }

    } else {

        if (!($.inArray(draggableId, composition_sensors[droppableId]) > -1)) {
            composition_sensors[droppableId].push(draggableId);
            ui.draggable.clone().appendTo($(this));
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
var allTheNeeds = [];

var declareNeeds = function () {
    establishCompositions();
    allTheNeeds.forEach(function (oneNeed, index) {
        console.log(oneNeed);
        expression.need(oneNeed, function (answer) {
            console.log(answer);
            oneNeed['graphType'] = answer;
            document.cookie = JSON.stringify(allTheNeeds);
        }, cantDo);
    });
};
var cantDo = function() {
    //TODO: modale qui explique que c'est pas possible
    console.log('IT\'S IMPOSSIBRRRRUUUUU');
};

var establishCompositions = function() {
    allTheNeeds = [];
    for (var i = 0; i < maxOfWidgets; i++) {
        allTheNeeds.push(
            {
                "needs": composition_needs[i],
                "sensors": composition_sensors[i]
            }
        )
    }
};

var sensors; //This array contains all the sensors we have
//these are the visualization intentions we know of and use. Should be part of Ivan's work.

var needs = [{name: "Comparison"}, {name: "Mock need"}, {name: "See status"}, {name: "Overtime"}, {name: "Relationships"}, {name: "Hierarchy"}, {name: "Proportion"}, {name: "Summarize"}];
var needsSimple = ["Comparison", "Mock need", "See status", "Overtime", "Relationships", "Hierarchy", "Proportion", "Summarize"];
var maxOfWidgets = 1; //this determines how many boxes are drawn in the center of the page
var navbar = [];
var selectedBox = 0;

/**
 * Get all buildings sensors et placements
 */
$.get(mainServer + "container/Root/child")
    .done(function (data) {
        sensors = data;
        initWindowsData();
    });


var allTheNeeds = [];
/***********************************
 ******* Init window data *********
 * This method fills the 3 panels of the page : the needs, the widget boxes, and the sensors.
 * It also instantiates the variables we need
 ***********************************/
function initWindowsData() {

    for (var i = 0; i < maxOfWidgets; i++) {
        allTheNeeds[i] = {"needs": [], "sensors": [], "graphType": ""};
        addTableRow(i);
    }

    position = sensors;
    buildings = sensors.childContainer;
    navbar.push(position.name);
    addNeeds();
    navigation();
}


/**
 * This adds a row to the middle panel, with the widgets.
 * For each, we also add a "delete" button, to remove all it contains if the user made a mistake
 */
var addTableRow = function (index) {
    $("#add-rows").append('<div class="well col-md-10" id="'
        + index
        + '" style="min-height: 80px;"></div>'
        + '<div class="col-md-2"> <br/>'
        + '<div class="btn btn-default" onclick="deleteWidgetContent(' + index + ')"><span class="glyphicon glyphicon-trash">'
        + '</span></div></div>');

    updateDisableBox();
};

function updateDisableBox() {

    $("#add-rows > div").each(function () {
        var id = $(this).attr('id');
        if (id == selectedBox) {
            $(this).css("border-color", "green");
            $("#" + id).droppable({drop: dropIt, disabled: false});
        } else {
            $(this).css("border-color", "red");
            $("#" + id).droppable({drop: dropIt, disabled: true});
        }
    });
}

$("#add-rows").click(function (event) {
    selectedBox = event.target.id;

    $("#add-rows > div").each(function () {
        var id = $(this).attr('id');
        if (id === selectedBox) {
            $(this).css("border-color", "green");
            $("#" + id).droppable({drop: dropIt, disabled: false});
        } else {
            $(this).css("border-color", "red");
            $("#" + id).droppable({drop: dropIt, disabled: true});
        }
    });
});


/**
 * Function to add new widget boxes
 * WE need to expand the different arrays that depend on the nb of widgets boxes as well !
 * For now, when we add a line, the other boxes become unavailable !
 */
var addAWidget = function () {
    allTheNeeds[maxOfWidgets] = {"needs": [], "sensors": [], "graphType": ""};

    addTableRow(maxOfWidgets);
    /*var theId = (maxOfWidgets-1).toString();
     console.log(maxOfWidgets);
     console.log(theId);
     document.getElementById(theId).disabled = true;
     */
    maxOfWidgets += 1;

};

/////////////////////////////////////// Removing a widget box //////////////////////////////////////////////////
var removeAWidget = function () {
    //you want to remove a widget !

    var domSize = $("#add-rows div").length;

    if (domSize > 3) {
        if (parseInt(+selectedBox + 1) === (domSize / 3)) {
            selectedBox--;
            for (var i = 0; i < 3; i++)
                $('#add-rows div').last().remove();
            updateDisableBox();
        } else {
            for (var i = 0; i < 3; i++)
                $('#add-rows div').last().remove();
        }
        allTheNeeds.splice(-1, 1);
        maxOfWidgets -= 1;
    }
};

/*
 This functions empties a widget box, making it back to its original state
 */
var deleteWidgetContent = function (widgetId) {
    allTheNeeds[widgetId] = {"needs": [], "sensors": [], "graphType": ""};
    $('#' + widgetId).empty();
};


/**
 * This function fills the visulization needs panel, and set its elements to being draggable elements
 */
function addNeeds() {
    $("#add-need").empty();

    for (var i = 0; i < needs.length; i++) {
        $("#add-need").append(
            "<div style=\"padding: 20px 0 0 0; text-align : center\"><span style=\"cursor : pointer;\" class=\"draggable\" id=\"" + needs[i].name + "\">" + needs[i].name + "</span></div>"
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
            "<div class=\"row\"><a class=\"node\" style=\"cursor : pointer;\" id=\"" + i + "\">" + buildings[i].name + "</a></div>"
        );
    }

    if (position.directSensor != null) {
        for (var i = 0; i < position.directSensor.length; i++) {
            $("#add-captors").append(
                "<div class=\"row\"><span class=\"draggable\" id=\""
                + position.directSensor[i].name + "\" style=\"cursor : pointer;\">"
                + position.directSensor[i].displayName + "</span></div>"
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

function updateNavigation() {
    // clean DOM
    $(".breadcrumb").empty();

    for (var i = 0; i < navbar.length - 1; i++) {
        $(".breadcrumb").append("<li><a class=\"nave\" name=\"" + navbar[i] + "\" style=\"cursor : pointer;\">" + navbar[i] + "</a></li>");
    }
}

//TODO: doc entre cette méthode & la suivante ?
// click on building
$(document).on('click', '.nave', function (el) {

    var myelement = el.target.name;
    var navBar_copy = navbar;
    for (var i = navBar_copy.length - 1; i > 0; i--) {
        if (myelement != navBar_copy[i]) {
            navbar.pop();
            position = previous.pop();
            buildings = position.childContainer;
            navigation();
        } else {
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
    var self = this;
    var aTemporaryArrayOfNeeds = [];
    var draggableName = ui.draggable.attr("id");
    var droppableId = $(self).attr("id");
    //This is if we talk about a visualization need
    //It must exist, and it mustn't already be in the widget
    if ($.inArray(draggableName, needsSimple) > -1) {//TODO still works ?
        //if (needsSimple.indexOf(draggableName) > -1) {
        if (!($.inArray(draggableName, allTheNeeds[droppableId].needs) > -1)) {
            allTheNeeds[droppableId].needs.forEach(function (aNeed) {
                aTemporaryArrayOfNeeds.push(aNeed.name);
            });
            aTemporaryArrayOfNeeds.push(draggableName);
            expression.needList(aTemporaryArrayOfNeeds, function (answer) {
                var tmpSensorList = [];
                answer.forEach(function (oneSensorSet) {
                    oneSensorSet.sensors.forEach(function (sensor) {
                        tmpSensorList.push(sensor.name);
                    })
                });
                $.post(mainServer + 'sensors/common/hierarchical', {
                    "sensors": tmpSensorList
                }).done(function (data) {
                        //Resetting all the sensors data we have to get the new one
                        position = {};
                        buildings.splice(0, buildings.length);
                        navbar.splice(0, navbar.length);

                        position = data;
                        buildings = data.childContainer;
                        navbar.push(position.name);
                        navigation();
                        ui.draggable.clone().appendTo($(self));
                        allTheNeeds[droppableId].needs.push(draggableName);
                    })
                    .fail(function (data) {
                        console.log(data);
                    });
            }, function (error) {
                if (error.status === 400) {
                    alert(error.responseText);
                }
                console.log('IT\'S IMPOSSIBRRRRUUUUU');
            });
        }
    }
    else {//Means it's a sensor
        if (!($.inArray(draggableName, allTheNeeds[droppableId].sensors) > -1)) {
            var temporarySensorsList = [];

            $.get(mainServer + "sensor/" + draggableName + "/enhanced")
                .done(function (data) {
                    allTheNeeds[droppableId].sensors.forEach(function (aSensor) {
                        temporarySensorsList.push(aSensor);
                    });
                    temporarySensorsList.push(data);

                    expression.sensorList(temporarySensorsList, function (answer) {
                        needs = answer;
                        addNeeds();
                        //Here, we add a new sensor to the widget.
                        ui.draggable.clone().appendTo($(self));
                        createAndAddPercentButton(draggableName, droppableId);

                        allTheNeeds[droppableId].sensors.push(data);
                    }, function (error) {
                        console.log(error);
                    });
                });
        }
    }
}

//This method creates a percent button and appends it to a specific sensorname
var createAndAddPercentButton = function (draggableName, droppableId) {
    var togglePercent = document.createElement("button");        // Create a <button> element
    //  togglePercent.setAttribute('class', 'btn btn-default btn-xs');
    togglePercent.setAttribute('onclick', 'setColor(event, "' + draggableName + '", "' + droppableId + '", "#0000FF")');
    togglePercent.setAttribute('data-count', '1');
    togglePercent.setAttribute('style', 'display : -webkit-inline-box');
    var buttonContent = document.createTextNode("%");       // Create a text node
    togglePercent.appendChild(buttonContent);          // Append the text to <button>

    $("#add-rows > div").each(function () {
        if ($(this).attr('id') == droppableId) {
            $(this).append(togglePercent);
        }
    });

};

var setColor = function (event, btnName, widgetIndex, color) {
    var target = event.target,
        count = +target.dataset.count;

    allTheNeeds[widgetIndex].sensors.forEach(function (sensor) {
        if (sensor.name == btnName) {
            sensor.percent = count;
        }
    });

    if (count === 1) { //= wasn't selected before
        target.style.backgroundColor = color;
        target.dataset.count = 0;
    } else {
        target.style.backgroundColor = '#FFFFFF';
        target.dataset.count = 1;
    }

};


/*******************************
 **** JSON Of composition ******
 ******************************/
var declareNeeds = function () {
    allTheNeeds.forEach(function (oneNeed, index) {
        //We only ask the composition server if what was asked is possible enough
        expression.need(oneNeed, function (answer) {
            oneNeed.graphType = answer;
            localStorage.setItem("bar", JSON.stringify(allTheNeeds));
            //If this is our last callback, set the whole result in local storage.
            //Better than cookie bc same behaviour throughout browsers.
        }, function () {
            console.log('IT\'S IMPOSSIBRRRRUUUUU');
        });
    });
};

$(window).konami();
$(window).konami({
    code: [38, 38, 40, 40, 37, 39, 37, 39], // up up down down left right left right
    cheat: function () {
        console.log('cheat code activated');
        $(".tetris").attr("style", "width:250px; height:500px;");
        $(".tetris").blockrain();
    }
});
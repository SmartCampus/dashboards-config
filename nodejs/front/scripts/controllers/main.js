var sensors; //This array contains all the sensors we have

//these are the visualization intentions we know of and use. Should be part of Ivan's work.
//2 versions bc easier for now, even if not really useful...
var needsOrigin = [{name: "Comparison"}, {name: "See status"}, {name: "Overtime"}, {name: "Relationships"}, {name: "Hierarchy"}, {name: "Proportion"}, {name: "Summarize"}];
var needsSimpleOrigin = ["Comparison", "See status", "Overtime", "Relationships", "Hierarchy", "Proportion", "Summarize"];

var needs = [[{name: "Comparison"}, {name: "See status"}, {name: "Overtime"}, {name: "Relationships"}, {name: "Hierarchy"}, {name: "Proportion"}, {name: "Summarize"}]];
var needsSimple = [["Comparison", "See status", "Overtime", "Relationships", "Hierarchy", "Proportion", "Summarize"]];


$("#generateButton").attr("disabled", "disabled"); //The generate button starts by being disabled
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
    addNeeds(0);
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
        + '<div class="col-md-2" id="deleteWidget'+index+'"> <br/>'
        + '<div class="btn btn-default" onclick="removeAWidget(' + index + ')"><span class="glyphicon glyphicon-trash">'
        + '</span></div></div>');

    updateDisableBox();
};

function updateDisableBox() {

    $("#add-rows").find(" > div").each(function () {
        var id = $(this).attr('id');
        if (id == selectedBox) {
            $(this).css("border-color", "green");
            $("#" + id).droppable(
                {
                    drop: dropIt,
                    disabled: false,
                    activeClass: "myActiveDroppable"
                }
            );
        } else {
            $(this).css("border-color", "red");
            $("#" + id).droppable({drop: dropIt, disabled: true});
        }
    });
}

$("#add-rows").click(function (event) {
    selectedBox = event.target.id;

    $("#add-rows").find(" > div").each(function () {
        var id = $(this).attr('id');
        if (id === selectedBox) {
            addNeeds(selectedBox);
            $(this).css("border-color", "green");
            $("#" + id).droppable(
                {
                    drop: dropIt,
                    disabled: false,
                    activeClass: "myActiveDroppable"
                });
        } else {
            $(this).css("border-color", "red");
            $("#" + id).droppable({drop: dropIt, disabled: true});
        }
    });
});


/**
 * Function to add new widget boxes
 * We need to expand the array describing the widgets
 * For now, when we add a line, the other boxes become unavailable !
 */
var addAWidget = function () {
    allTheNeeds[maxOfWidgets] = {"needs": [], "sensors": [], "graphType": ""};

    needs[maxOfWidgets] = needsOrigin;
    needsSimple[maxOfWidgets] = needsSimpleOrigin;
    addTableRow(maxOfWidgets);

    maxOfWidgets += 1;

};

/////////////////////////////////////// Removing a widget box //////////////////////////////////////////////////
var removeAWidget = function (widgetId) {
    var $addRowsDiv = $("#add-rows").find(" > div");
    var domSize = $addRowsDiv.length;
    $('#' + widgetId).remove();
    $('#deleteWidget' + widgetId).remove();

    console.log(this);
    console.log($(this));
   /* if (domSize > 3) { //means I have at least 2 widget boxes : so we can delete one indeed
        if (parseInt(+selectedBox + 1) === (domSize / 3)) { //It was the last box that was selected
            selectedBox--;
            $addRowsDiv.slice(-2).remove();
            updateDisableBox();
        } else { //it's not the last box that was selected
            $addRowsDiv.slice(-2).remove();
        }
        allTheNeeds.splice(-1, 1);
        maxOfWidgets -= 1;
    }
    */
};

/*
 This functions empties a widget box, making it back to its original state
 Not used right now
 */
var deleteWidgetContent = function (widgetId) {
    allTheNeeds[widgetId] = {"needs": [], "sensors": [], "graphType": ""};
    $('#' + widgetId).empty();
};


/**
 * This function fills the visulization needs panel, and set its elements to being draggable elements
 */
function addNeeds(boxIndex) {
    var $addNeed = $("#add-need").empty();

    for (var i = 0; i < needs[boxIndex].length; i++) {
        $addNeed.append(
            "<div class=\"needInList\"><span style=\"cursor : grab;\" class=\"draggable\" id=\"" + needs[boxIndex][i].name + "\">" + needs[boxIndex][i].name + "</span></div>"
        );

        $(".draggable").draggable({
            //This defines what the user is actually dragging around
            helper: function (event) {
                return $("<div style='cursor: grabbing' id='" + event.target.id + "'>" + event.target.innerHTML + "</div>");
            },
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
    var $addCaptors = $("#add-captors").empty();


    $addCaptors.append("<div class=\"row\"><h3>" + position.name + "</h3></div>");
    var i;
    for (i = 0; i < buildings.length; i++) {
        $addCaptors.append(
            "<div class=\"row\"><a class=\"node\" style=\"cursor : pointer;\" id=\"" + i + "\">" + buildings[i].name + "</a></div>"
        );
    }

    if (position.directSensor != null && typeof(position.directSensor) !== 'undefined' && position.directSensor != [null]) {
        for (i = 0; i < position.directSensor.length; i++) {
            if (position.directSensor[i] != null) {
                $addCaptors.append(
                    "<div class=\"row sensorInList\"><span class=\"draggable\" id=\""
                    + position.directSensor[i].name + "\" style=\"cursor : grab;\">"
                    + position.directSensor[i].displayName + "</span></div>"
                );
                $(".draggable").draggable({
                    helper: function (event) {
                        return $("<div style='cursor: grabbing'  id='" + event.target.id + "'>" + event.target.innerHTML + "</div>");
                    },
                    revert: "invalid"
                });
            }
        }
    }

    updateNavigation();
}

function updateNavigation() {
    // clean DOM
    var $breadCrumb = $(".breadcrumb").empty();

    for (var i = 0; i < navbar.length - 1; i++) {
        $breadCrumb.append("<li><a class=\"nave\" name=\"" + navbar[i] + "\" style=\"cursor : pointer;\">" + navbar[i] + "</a></li>");
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
    var draggableId = ui.draggable.attr("id");
    var droppableId = $(self).attr("id");
    //This is if we talk about a visualization need
    //It must exist, and it mustn't already be in the widget
    if ($.inArray(draggableId, needsSimple[droppableId]) > -1) {
        if (!($.inArray(draggableId, allTheNeeds[droppableId].needs) > -1)) {
            allTheNeeds[droppableId].needs.forEach(function (aNeed) {
                aTemporaryArrayOfNeeds.push(aNeed.name);
            });
            aTemporaryArrayOfNeeds.push(draggableId);
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
                        buildings.splice(0, buildings.length);
                        navbar.splice(0, navbar.length);

                        position = data;
                        buildings = data.childContainer;
                        navbar.push(position.name);
                        navigation();
                        var needSpan = $(document.createElement('span'));
                        needSpan.attr("id", draggableId);
                        needSpan.css('cursor', 'default');
                        needSpan.html(draggableId);
                        needSpan.appendTo($(self));
                        allTheNeeds[droppableId].needs.push(draggableId);
                        $("#generateButton").removeAttr("disabled");
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
        if (!($.inArray(draggableId, allTheNeeds[droppableId].sensors) > -1)) {
            var temporarySensorsList = [];

            $.get(mainServer + "sensor/" + draggableId + "/enhanced")
                .done(function (enhancedSensor) {
                    allTheNeeds[droppableId].sensors.forEach(function (aSensor) {
                        temporarySensorsList.push(aSensor);
                    });
                    temporarySensorsList.push(enhancedSensor);

                    expression.sensorList(temporarySensorsList, function (answer) {
                        needs[droppableId] = answer;
                        addNeeds(droppableId);
                        //Here, we add a new sensor to the widget.
                        var needSpan = $(document.createElement('span'));
                        needSpan.attr("id", draggableId);
                        needSpan.css('cursor', 'default');
                        needSpan.html(enhancedSensor.displayName);
                        needSpan.appendTo($(self));
                        createAndAddPercentButton(($(self)).attr('id'), draggableId, droppableId);
                        $("#generateButton").removeAttr("disabled");
                        allTheNeeds[droppableId].sensors.push(enhancedSensor);
                    }, function (error) {
                        console.log(error);
                    });
                });
        }
    }
}

////////////////////////////////////// Percent button on sensors  //////////////////////////////////////////////////////
//This method creates a percent button and appends it to a specific sensorname
var createAndAddPercentButton = function (widgetBoxId, draggableName, droppableId) {
    var togglePercent = $(document.createElement("button"));        // Create a <button> element
    togglePercent.attr('onclick', 'setColor(event, "' + draggableName + '", "' + droppableId + '", "#20C6D7")');
    togglePercent.attr('class', 'btn btn-default btn-xs');
    togglePercent.attr('data-count', '1');
    togglePercent.html("%");          // Append the text to <button>

    togglePercent.appendTo($("#" + widgetBoxId + " #" + draggableName));
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
            //Better than cookie bc same behaviour throughout browsers.
            if (index == allTheNeeds.length - 1) {
                console.log('we got everything !');
                localStorage.setItem("widgetsDescription", JSON.stringify(allTheNeeds));
                //Once we got everything
                $("#dashboardNameForm").show();
                $("#generateButton").hide();
            }
        }, function () {
            $("#generateButton").attr("disabled", "disabled"); //The generate button becomes disabled if something impossible was asked...
            console.log('IT\'S IMPOSSIBRRRRUUUUU');
        });
    });
};

var setDashboardName = function () {
    localStorage.setItem("dashboardTitle", $("#dashboardName").val());

    return true;
};

//////////////////////////////////////// Quentin's easter egg ///////////////////////////////////////////////
$(window).konami();
$(window).konami({
    code: [38, 38, 40, 40, 37, 39, 37, 39],
    cheat: function () {
        console.log('cheat code activated');
        var $tetris = $(".tetris").attr("style", "width:250px; height:500px;");
        $tetris.blockrain();
    }
});
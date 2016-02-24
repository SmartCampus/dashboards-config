var sensors; //This array contains all the sensors we have

//these are the visualization intentions we know of and use. Should be part of Ivan's work.
//2 versions bc easier for now, even if not really useful...

var needsOrigin = [{name: "Comparison", "image":"comparisons.png"}, {name: "Location", "image":"location.png"}, {name: "Pattern", "image":"patterns.png"}, {name: "See Status", "image":"reference_tool.png"}, {name: "Overtime", "image":"data_over_time.png"}, {name: "Relationships", "image":"relationships.png"}, {name: "Hierarchy", "image":"hierarchy.png"}, {name: "Proportion", "image":"proportions.png"}, {name: "Range", "image":"range.png"}];
var needsSimpleOrigin = ["Comparison", "Location", "Pattern", "See Status", "Overtime", "Relationships", "Hierarchy", "Proportion", "Summarize"];

var needs = [];


$("#generateButton").attr("disabled", "disabled"); //The generate button starts by being disabled
var maxOfWidgets = 1; //this determines how many boxes are drawn in the center of the page

var navbar = [];
var selectedBox = 0;
var allTheNeeds = [];
var sensorsBox = [];

var startDate, endDate;

/**
 * Get all buildings sensors et placements
 */
$.get(mainServer + "container/Root/child")
    .done(function (data) {
        sensors = data;
        initWindowsData();
    });

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
    sensorsBox.push(sensors);
}


/**
 * This adds a row to the middle panel, with the widgets.
 * For each, we also add a "delete" button, to remove all it contains if the user made a mistake
 */
var addTableRow = function (index) {

    $("#add-rows").append('' +
        '<form class="form-inline text-left" id="widgetNameForm' + index + '" style="padding-bottom: 0.5em">' +
        '<input class="form-control" id="widgetTitle' + index + '" placeholder="Your widget\'s name"> ' +
        '</form>' +
        '<div class="well col-md-10" id="'
        + index
        + '" style="min-height: 80px;"></div>'
        + '<div class="col-md-2" id="deleteWidget' + index + '"> <br/>'
        + '<div class="btn btn-default" onclick="removeAWidget(' + index + ')"><span class="glyphicon glyphicon-trash">'
        + '</span></div></div>');

    updateDisableBox();
};

function updateDisableBox() {
    $("#add-rows").find(" > div").each(function () {
        var id = $(this).attr('id');
        if (id == selectedBox) {
            $(this).css("border-color", "#0266C8");
            $(this).css("border-width", "3px");
            $("#" + id).droppable(
                {
                    drop: dropIt,
                    disabled: false,
                    activeClass: "myActiveDroppable"
                }
            );
        } else {
            $(this).css("border-color", "black");
            $(this).css("border-width", "1px");
            $("#" + id).droppable({drop: dropIt, disabled: true});
        }
    });
};


// change box
$("#add-rows").click(function (event) {

    if(event.target.id.length > 2){
        selectedBox = $(event.target).parent().attr('id');
    }else{
        selectedBox = event.target.id;
    }

    $("#add-rows").find(" > div").each(function () {
        var id = $(this).attr('id');
        if (id === selectedBox) {
            addNeeds(selectedBox);
            $(this).css("border-color", "#0266C8");
            $(this).css("border-width", "3px");
            $("#" + id).droppable(
                {
                    drop: dropIt,
                    disabled: false,
                    activeClass: "myActiveDroppable"
                });
            position = sensorsBox[selectedBox];
            buildings = position.childContainer;
            goTo(navbar);

            navigation();
        } else {
            $(this).css("border-color", "black");
            $(this).css("border-width", "1px");
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
    $.get(mainServer + "container/Root/child")
        .done(function (data) {
            sensorsBox.push(data);
        });

    allTheNeeds[maxOfWidgets] = {"needs": [], "sensors": [], "graphType": ""};

    needs[maxOfWidgets] = needsOrigin;
    addTableRow(maxOfWidgets);

    $("#generateButton").attr("disabled", "disabled");
    $("#dashboardNameForm").hide();

    maxOfWidgets += 1;

};

/////////////////////////////////////// Removing a widget box //////////////////////////////////////////////////
var removeAWidget = function (widgetId) {
    var $addRowsDiv = $("#add-rows").find(" > div");
    var domSize = $addRowsDiv.length;
    $('#' + widgetId).remove();
    $('#deleteWidget' + widgetId).remove();
    $('#widgetNameForm' + widgetId).remove();
    maxOfWidgets -= 1;
    sensorsBox[widgetId] = null;
    allTheNeeds.splice(widgetId, 1);
    $("#generateButton").removeAttr("disabled");
    $("#dashboardNameForm").hide();
    /* TODO :  Auto select an other box
    for(var i = 0; i < sensorsBox.length; i++) {
        if(sensorsBox[i] != null) {

        }
    }**/

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
    var $addIntent = $("#add-need").empty();
    needs[boxIndex] = [];
    needs[boxIndex] = needsOrigin;
    for (var i = 0; i < needs[boxIndex].length; i++) {
        $addIntent.append(
            '<div id="' + needs[boxIndex][i].name + '" style="cursor:grab;" class="draggable col-md-6">' +
            '<img src="/assets/images/intentions/'+needs[boxIndex][i].image+'"/>' +
            '<div style="margin-bottom:1em;">' + needs[boxIndex][i].name  + '</div>'+
            '</img></div>'
        );

        $(".draggable").draggable({
            //This defines what the user is actually dragging around
            helper: function (event) {
                return $('<div style="cursor: grabbing" id="' + event.currentTarget.id + '">' + event.currentTarget.id + '</div>');
            },
            revert: "invalid",
            cursorAt: { top: 0, left: 0 }
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


    $addCaptors.append("<div><h2>" + position.name + "</h2></div>");
    var i;
    for (i = 0; i < buildings.length; i++) {
        $addCaptors.append(
            "<div class=\"row\"><a class=\"node\" style=\"cursor : pointer;\" id=\"" + i + "\">" + buildings[i].name + "</a> -  <span class=\"badge\" style=\"background:#4781ff;\">"+ buildings[i].amountOfSensors+"</span></div>"
    );
    }

    if (position.directSensor != null && typeof(position.directSensor) !== 'undefined' && position.directSensor != [null]) {
        for (i = 0; i < position.directSensor.length; i++) {
          //  var a = "postit"+((i % 4) +1);
            console.log(i);
            if (position.directSensor[i] != null) {
                console.log(position.directSensor[i]);
                console.log(position.directSensor[i].displayName);
                $addCaptors.append(
                    //"<div><span class='draggable text-center'>"+position.directSensor[i].displayName + "</span></div>"
                    "<div><span class='draggable text-center' id='"+ position.directSensor[i].name +"' style='cursor : grab;'> "
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
    else {
        $addCaptors.append("<div>There isn't any compatible sensor here. </div>");
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

/**
 * Go to a path of captors
 * @param myPath
 */
function goTo(myPath) {
    previous = [];

    for(var i = 0; i < myPath.length; i++) {
        previous.push(position);
        for(var j = 0; j < buildings.length; j++){
            if(buildings[j].name == myPath[i]){
                position = buildings[j];
                buildings = position.childContainer;
            }
        }
    }
}


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
    if ($.inArray(draggableId, needsSimpleOrigin) > -1) {
        if (!($.inArray(draggableId, allTheNeeds[droppableId].needs) > -1)) {
            allTheNeeds[droppableId].needs.forEach(function (aNeed) {
                aTemporaryArrayOfNeeds.push(aNeed);
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
                    position = data;
                    buildings = data.childContainer;
                    sensorsBox[selectedBox] = data;
                    goTo(navbar);
                    navigation();
                    var needSpan = $(document.createElement('span'));
                    needSpan.attr("id", draggableId);
                    needSpan.css('cursor', 'default');
                    needSpan.html(draggableId);
                    needSpan.appendTo($(self));
                    br = $(document.createElement('br'));
                    br.appendTo(needSpan);
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
                        enhancedSensor["salle"] = (position.name).replace(/ /g,"_");
                        needs[droppableId] = answer;
                        addNeeds(droppableId);
                        console.log(enhancedSensor);
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

    var formGroup = $(document.createElement("span"));
    formGroup.attr('class', 'input-group input-group-xs');

    var selectList = $(document.createElement("select"));
    selectList.attr('class', 'input-small tinySelectGroup');
    selectList.attr('id', 'select' + draggableName);

    var optionRaw = $(document.createElement("option"));
    optionRaw.html("raw");
    optionRaw.appendTo(selectList);

    var optionPercent = $(document.createElement("option"));
    optionPercent.html("%");
    optionPercent.appendTo(selectList);

    selectList.appendTo(formGroup);
    formGroup.appendTo($("#" + widgetBoxId + " #" + draggableName));
    var br = $(document.createElement('br'));
    br.appendTo(formGroup);
};


/*******************************
 **** JSON Of composition ******
 ******************************/
var declareNeeds = function () {
    allTheNeeds.forEach(function (oneNeed, index) {
        oneNeed.sensors.forEach(function (sensor) {
            if ($("#select" + sensor.name + " option:selected", "#" + index).text() != 'raw') {
                sensor.percent = true;
            }
            oneNeed.title = $("#widgetTitle" + index).val();
        });
        //We only ask the composition server if what was asked is possible enough
        expression.need(oneNeed, function (answer) {
            oneNeed.graphType = answer;
            //Better than cookie bc same behaviour throughout browsers.
            if (index == allTheNeeds.length - 1) {
                localStorage.setItem("widgetsDescription", JSON.stringify(allTheNeeds));
                localStorage.setItem("startDate", startDate);
                localStorage.setItem("endDate", endDate);

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

$('#beginTime1')
    .datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });

$('#endTime1')
    .datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    });


var validDates = function () {
    $(".myerror").empty();

    if(!$('#beginTime1').data('date') || !$('#endTime1').data('date')){
        $('.myerror').show(0).delay(2000).hide(0);
        $('.myerror').append('<p class=\'theerror\'>Please complet all fields !</p>');
        return;
    }else if($('#beginTime1').data('date') > $('#endTime1').data('date')){
        $('.myerror').show(0).delay(2000).hide(0);
        $('.myerror').append('<p class=\'theerror\'>Begin date must be older that end one !</p>');
        return;
    }else{
        $('#myModal').modal('hide');
        startDate = $('#beginTime1').data('date');
        endDate = $('#endTime1').data('date');
    }
};

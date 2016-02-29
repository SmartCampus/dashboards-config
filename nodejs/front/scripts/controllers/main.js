var sensors; //This array contains all the sensors we have

//these are the visualization intentions we know of and use. Should be part of Ivan's work.
//2 versions bc easier for now, even if not really useful...

var needsOrigin = [{name: "Comparison", "image":"comparison.png"}, {name: "Location", "image":"location.png"}, {name: "Pattern", "image":"pattern.png"}, {name: "See Status", "image":"see status.png"}, {name: "Overtime", "image":"overtime.png"}, {name: "Relationships", "image":"relationships.png"}, {name: "Hierarchy", "image":"hierarchy.png"}, {name: "Proportion", "image":"proportion.png"}, {name: "Range", "image":"range.png"}];
var needsSimpleOrigin = ["Comparison", "Location", "Pattern", "See Status", "Overtime", "Relationships", "Hierarchy", "Proportion", "Summarize"];
var hierarchyRoute = "container/CampusSophiaTech/child";
var listSensorsRoute = "sensors?container=Root";
var needs = [];
var listSensors;

$("#generateButton").attr("disabled", "disabled"); //The generate button starts by being disabled
var maxOfWidgets = 1; //this determines how many boxes are drawn in the center of the page

var navbar = [];
var selectedBox = 0;
var allTheNeeds = [];
var sensorsBox = [];

var startDate, endDate;
var filters = [];
/**
 * Get all buildings sensors et placements
 */
$.get(mainServer + hierarchyRoute)
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
    }

    position = sensors;
    buildings = sensors.childContainer;
    navbar.push(position.name);
    createNeeds(0);
    navigation();
    sensorsBox.push(sensors);

    for (var i = 0; i < maxOfWidgets; i++) {
        addTableRow(i);
    }

    $.get(secondServer + listSensorsRoute)
        .done(function (data) {
            listSensors = data;
            initListSensors();
    });
}

/** Display option **/
function displayOption(val) {
    if ( val ) {
        $('.filtersOptions').hide();
        $('#list-captors').hide();
        $('.breadcrumb').show();
        $('#add-captors').show();
    }else{
        $('.breadcrumb').hide();
        $('#add-captors').hide();
        $('.filtersOptions').show();
        $('#list-captors').show();
    }
}

/*** FILTERS SENSORS ***/
function validate(val) {
    if ($(val).is(':checked')) {
        filters.push($(val).attr('id'));
    } else {
        var index = filters.indexOf($(val).attr('id'));
        filters.splice(index, 1);
    }
    updateListSensors();
}

function updateListSensors() {
    var $mylistSensors = $("#list-captors").empty();
    if(filters.length == 0){
            $.each(listSensors,function(i){
            $mylistSensors.append(
                '<div class="draggableSensor" id="' + listSensors[i].name + '" style="cursor: -webkit-grab; cursor:-moz-grab;">'
                + '<img class="sensorIcon" src="/assets/images/sensorIcons/' + listSensors[i].kind + '.png">'
                + listSensors[i].displayName
                + '</img> </div>'
            );
        });
    }else{
        $.each(listSensors,function(i){
            if ($.inArray(listSensors[i].category,filters) !== -1) {
                $mylistSensors.append(
                    '<div class="draggableSensor" id="' + listSensors[i].name + '" style="cursor: -webkit-grab; cursor:-moz-grab;">'
                    + '<img class="sensorIcon" src="/assets/images/sensorIcons/' + listSensors[i].kind + '.png">'
                    + listSensors[i].displayName
                    + '</img> </div>'
                );
            }
        });
    }
    
    $(".draggableSensor").draggable({
        helper: function (event) {
            return $("<div style='cursor:-webkit-grabbing; cursor:-moz-grabbing;'  id='" + event.currentTarget.id + "'>" + event.currentTarget.innerHTML + "</div>");
        },
        revert: "invalid",
        cursorAt: { bottom: 10, left: 60 }
    });

    $('#search').keyup();
}

function initListSensors() {
    var myFilter = [];
    var $mylistSensors = $("#list-captors").empty();
    var $myFiltersSensors = $("#filters").empty();

    var lengthListSensors = listSensors.length;

    $.each(listSensors,function(i){
        if ($.inArray(listSensors[i].category,myFilter)==-1) myFilter.push(listSensors[i].category);
    });

    $.each(myFilter,function(i){
        $myFiltersSensors.append(
            "<div class=\"col-md-4\"><label class=\"checkbox-inline\">" +
            "<input type=\"checkbox\" id=\""+myFilter[i]+"\" onclick=\"validate("+myFilter[i]+")\">"+myFilter[i]+
            "</label></div>"
        );
    });

    $.each(listSensors,function(i){
        $mylistSensors.append(
            '<div class="draggableSensor" id="' + listSensors[i].name + '" style="cursor: -webkit-grab; cursor:-moz-grab;">'
            + '<img class="sensorIcon" src="/assets/images/sensorIcons/' + listSensors[i].kind + '.png">'
            + listSensors[i].displayName
            + '</img> </div>'
        );
    });

    $(".draggableSensor").draggable({
        helper: function (event) {
            return $("<div style='cursor:-webkit-grabbing; cursor:-moz-grabbing;'  id='" + event.currentTarget.id + "'>" + event.currentTarget.innerHTML + "</div>");
        },
        revert: "invalid",
        cursorAt: { bottom: 10, left: 60 }
    });

}


$('#search').keyup(function() {
    var $rows = $('#list-captors .draggableSensor');

    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});



/**
 * This adds a row to the middle panel, with the widgets.
 * For each, we also add a "delete" button, to remove all it contains if the user made a mistake
 */
var addTableRow = function (index) {

    $("#add-rows").append('' +
        '<form class="form-inline text-left" id="widgetNameForm' + index + '" style="padding-bottom: 0.5em">'
        + '<input class="form-control" id="widgetTitle' + index + '" placeholder="Your widget\'s name"></form>'
        + '<div class="well col-md-10" id="' + index + '" style="min-height: 80px;"></div>'
        + '<div class="col-md-2" id="deleteWidget' + index + '"> <br/>'
        + '<div class="btn btn-default" onclick="removeAWidget(' + index + ')"><span class="glyphicon glyphicon-trash">'
        + '</span></div></div>');

    updateDisableBox(index);
};

function updateDisableBox(index) {
    selectedBox = index;

    $("#add-rows").find(" > div").each(function () {
        var id = $(this).attr('id');
        if(id.length > 2){
        }else{
            if (id == index) {
                addAnswerNeeds(selectedBox, needs[selectedBox]);

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
        }
    });
};


// change box
$("#add-rows").click(function (event) {
    if(event.target.id.indexOf('widgetTitle') != -1 || event.target.id.indexOf('widgetNameForm') != -1){
        // do nothing
    }else{
        if(event.target.id.length > 2){
            selectedBox = $(event.target).parent().attr('id');
        }else{
            selectedBox = event.target.id;
        }

        $("#add-rows").find(" > div").each(function () {
            var id = $(this).attr('id');
            if (id === selectedBox) {
                addAnswerNeeds(selectedBox, needs[selectedBox]);
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
    }
});


/**
 * Function to add new widget boxes
 * We need to expand the array describing the widgets
 * For now, when we add a line, the other boxes become unavailable !
 */
var addAWidget = function () {
    $.get(mainServer + hierarchyRoute)
        .done(function (data) {
            sensorsBox.push(data);
        });

    allTheNeeds[maxOfWidgets] = {"needs": [], "sensors": [], "graphType": ""};
    needs.push(needsOrigin);
    addTableRow(maxOfWidgets);

    $("#generateButton").show().attr("disabled", "disabled");
    $("#dateButton").show();
    $("#dashboardNameForm").hide();

    maxOfWidgets += 1;
};
var dashboardNameForm = document.getElementById('dashboardNameForm');
dashboardNameForm.onsubmit = function(e) {
    e.preventDefault();
    setDashboardName();
    window.location.href ="dashboard.html";
};
/////////////////////////////////////// Removing a widget box //////////////////////////////////////////////////
var removeAWidget = function (widgetId) {

    $('#' + widgetId).remove();
    $('#deleteWidget' + widgetId).remove();
    $('#widgetNameForm' + widgetId).remove();
    //maxOfWidgets -= 1;
    //  sensorsBox[widgetId] = null;
    sensorsBox[widgetId] = null;
    allTheNeeds[widgetId] = null;
    needs[widgetId] = null;

    $("#generateButton").show().removeAttr("disabled");
    $("#dateButton").show();
    $("#dashboardNameForm").hide();


    if(selectedBox == widgetId){
        for(var i = 0; i < allTheNeeds.length; i++){
            if(allTheNeeds[i] != null){
                updateDisableBox(i);
                break;
            }
        }
    }else{
        updateDisableBox(widgetId);
    }


};

/*
 This functions empties a widget box, making it back to its original state
 Not used right now
 */
var deleteWidgetContent = function (widgetId) {
    allTheNeeds[widgetId] = {"needs": [], "sensors": [], "graphType": ""};
    $('#' + widgetId).empty();
};


function addAnswerNeeds(droppableId, answer) {
    answer.forEach(function(needAnswer) {
       needAnswer.image = needAnswer.name+'.png';
    });
    needs[droppableId] = [];

    needs[droppableId] = answer;
    addNeeds(droppableId);
}

function createNeeds(boxIndex) {
    needs[boxIndex] = [];
    needs[boxIndex] = needsOrigin;
    addNeeds(boxIndex);
}
/**
 * This function fills the visulization needs panel, and set its elements to being draggable elements
 */
function addNeeds(boxIndex) {
    var $addIntent = $("#add-need").empty();

    for (var i = 0; i < needs[boxIndex].length; i++) {
        $addIntent.append(
            '<div id="' + needs[boxIndex][i].name + '" style="cursor: -webkit-grab; cursor:-moz-grab;" class="draggableNeed col-md-6">' +
            '<img src="/assets/images/intentions/'+needs[boxIndex][i].image+'"/>' +
            '<div style="margin-bottom:1em;">' + needs[boxIndex][i].name  + '</div>'+
            '</div>'
        );
    }
    $(".draggableNeed").draggable({
        //This defines what the user is actually dragging around
        helper: function (event) {
            return $('<div style="cursor:-webkit-grabbing; cursor:-moz-grabbing;" id="' + event.currentTarget.id + '">' + event.currentTarget.id + '</div>');
        },
        revert: "invalid",
        cursorAt: { bottom: 7, left: 25 }
    });
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
    //We append a link to every room / place we can access from position
    for (i = 0; i < buildings.length; i++) {
        $addCaptors.append(
            "<div class=\"row\"><a class=\"node\" style=\"cursor : pointer;\" id=\"" + i + "\">"
            + buildings[i].name + "</a> -  <span class=\"badge\" style=\"background:#4781ff;\">"
            + buildings[i].amountOfSensors+"</span></div>"
    );
    }
    $addCaptors.append( "<hr><div id='directSensors"+position.name.replace(/ /g,"_")+"' class='text-left'></div>");
    var $directSensorsPosition = $("#directSensors"+position.name.replace(/ /g,"_"));

    //Then, in position we check if there is any sensor
    if (position.directSensor != null && typeof(position.directSensor) !== 'undefined' && position.directSensor != [null]) {
        for (i = 0; i < position.directSensor.length; i++) {
          //  var a = "postit"+((i % 4) +1);
            if (position.directSensor[i] != null) {
                $directSensorsPosition.append(
                    '<div class="draggableSensor" id="' + position.directSensor[i].name + '" style="cursor: -webkit-grab; cursor:-moz-grab;">'
                    + '<img class="sensorIcon" src="/assets/images/sensorIcons/' + position.directSensor[i].kind + '.png">'
                    + position.directSensor[i].displayName
                    + '</img> </div>'
                );
            }
        }
    }
    else {
        $directSensorsPosition.append("<div>There isn't any compatible sensor here. </div>");
    }

    $(".draggableSensor").draggable({
        helper: function (event) {
            return $("<div style='cursor:-webkit-grabbing; cursor:-moz-grabbing;'  id='" + event.currentTarget.id + "'>" + event.currentTarget.innerHTML + "</div>");
        },
        revert: "invalid",
        cursorAt: { bottom: 10, left: 60 }
    });

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
                    addToBox($(self), draggableId, draggableId, null);
                    allTheNeeds[droppableId].needs.push(draggableId);
                    $("#generateButton").show().removeAttr("disabled");
                    $("#dateButton").show();
                })
                    .fail(function (data) {
                        console.log(data);
                    });
            }, function (error) {
                if (error.status === 400) {
                    console.log(error.responseText);
                    alert("Sorry, if you put this intent into to widget, we cannot find any compatible sensor. ");
                }
            });
        }
    }
    else {//Means it's a sensor
        var alreadyHere = false;
        allTheNeeds[droppableId].sensors.forEach(function(completeSensor) {
            if (completeSensor.name == draggableId) {
                alreadyHere = true;
                return false;
            }
        });
        if (!alreadyHere) { //Always in this
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
                        addAnswerNeeds(droppableId, answer);
                        //Here, we add a new sensor to the widget.
                        addToBox($(self), draggableId, enhancedSensor.displayName, droppableId);
                        $("#generateButton").removeAttr("disabled");
                        $("#dateButton").show();
                        allTheNeeds[droppableId].sensors.push(enhancedSensor);
                    }, function (error) {
                        console.log(error);
                    });
                });
        }
    }
}

var addRemoveSign = function(selfToAppend, draggableId) {
    var removeSign = $(document.createElement('span'));
    removeSign.attr("class", "glyphicon glyphicon-remove-sign");
    removeSign.attr("onclick", "removeFromBox(" +selfToAppend.attr('id')+", '"+draggableId+"')");
    removeSign.css("cursor", "pointer");
    removeSign.css("padding-right", "0.3em");
    removeSign.appendTo(selfToAppend);
};

var addToBox = function(selfToAppend, draggableId, htmlContent, droppableId) {
    addRemoveSign(selfToAppend, draggableId);
    var needSpan = $(document.createElement('span'));
    needSpan.attr("id", draggableId);
    needSpan.css('cursor', 'default');
    needSpan.text(htmlContent);
    needSpan.appendTo(selfToAppend);
    if (droppableId !== null) {// means it's a sensor !
        createAndAddPercentButton(selfToAppend.attr('id'), draggableId, droppableId);
    }else {
        var br = $(document.createElement('br'));
        br.appendTo(needSpan);
    }
};

var removeFromBox = function(boxId, elementId) {
    $("#"+boxId +" > #" + elementId).prev().remove();
    $("#"+boxId +" > #" + elementId).remove();
    var index = allTheNeeds[boxId].needs.indexOf(elementId);
    if (index > -1) { //then it's a need we must remove !
        allTheNeeds[boxId].needs.splice(index, 1);
    }
    else { //it's a sensor
        allTheNeeds[boxId].sensors.forEach(function (aSensor, index) {
            if (aSensor.name == elementId) {
                allTheNeeds[boxId].sensors.splice(index, 1);
                return false;
            }
        });
    }
};

////////////////////////////////////// Percent button on sensors  //////////////////////////////////////////////////////
//This method creates a percent button and appends it to a specific sensorname
var createAndAddPercentButton = function (widgetBoxId, draggableName) {

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

    for(var i = allTheNeeds.length-1; i >= 0; i--){
        if(allTheNeeds[i] == null){
            allTheNeeds.splice(i, 1);
        }
    }

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
                    //Once we got everything
                    $("#dashboardNameForm").show();
                    $("#generateButton").hide();
                    $("#dateButton").hide();

                }
            }, function () {
                $("#generateButton").show().attr("disabled", "disabled"); //The generate button becomes disabled if something impossible was asked...
                $("#dateButton").show();
            });

    });
};

var setDashboardName = function () {
    localStorage.setItem("dashboardTitle", $("#dashboardName").val());
    if (typeof(startDate) == 'undefined' || typeof(endDate) == 'undefined') {
        console.log('no date defined');
        startDate = '2015-01-01 8:00:00';
        endDate = '2015-02-24 18:00:00';
    }
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);

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
    var $myError = $(".myerror");
    var $beginTime = $('#beginTime1');
    var $endTime = $('#endTime1');
    $myError.empty();

    if(!$beginTime.data('date') || !$endTime.data('date')){
        $myError.show(0).delay(2000).hide(0);
        $myError.append('<p class=\'theerror\'>Please complete all fields !</p>');
    }else if($beginTime.data('date') > $endTime.data('date')){
        $myError.show(0).delay(2000).hide(0);
        $myError.append('<p class=\'theerror\'>Begin date must be after end date !</p>');
    }else{
        $('#myModal').modal('hide');
        startDate = $beginTime.data('date');
        endDate = $endTime.data('date');
    }
};

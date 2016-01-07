var sensors;
var needs = ["Compare", "See status", "Summarize", "Hierarchy", "Proportion", "Other"];

var composition_sensors = [];
var composition_needs = [];

/**
 * Get all buildings captors et placements
 */
    (function getSensors(callback){
        $.get(mainServer+"container/Root/child")
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

        for( var i = 0; i < 3 ; i++ ){
            composition_needs[i]   = new Array();
            composition_sensors[i] = new Array();
        }

        position  = sensors;
        buildings = sensors.childContainer;
        previous.push(position);

        addTableRow();
        abc();
        navigation();
    }


    function addTableRow() {

        for( var i = 0 ; i < 4 ; i++ ){
            $("#add-rows").append( "<div class=\"droppable\" id=\""+i+"\" style=\"min-height: 70px; border: solid; margin-top: 30px\"></div>" );

            $( ".droppable" ).droppable({ drop: dropIt });
        }
    }


    function abc() {

        for(var i = 0; i < needs.length; i++){
            $("#add-need").append(
                "<div class=\"row\" style=\"padding: 20px 0 0 0\"><div class=\"draggable\" id=\""+needs[i]+"\"><p>"+needs[i]+"</p></div></div>"
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
        $( "#add-captors" ).empty();


        $("#add-captors").append( "<div class=\"row\"><h3>"+position.name+"</h3></div>" );

        for( var i = 0 ; i < buildings.length ; i++ ) {
            $("#add-captors").append(
                "<div class=\"row\"><a class=\"node\" id=\"" + i + "\">" + buildings[i].name + "</a></div>"
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

    // click on building
    $( document ).on( 'click' , '.node' , function(el) {

        previous.push( position );

        position = buildings[ parseInt( el.target.id ) ];

        buildings = position.childContainer;

        navigation();

    });



    // click on back button
    $( "#goback" ).click(function() {

        if(previous.length > 0){

            position = previous.pop();

            buildings = position.childContainer;

            navigation();
        }

    });




/************************
 **** DROP ELEMENT ******
 ***********************/



    function dropIt(event, ui) {

        var draggableId = ui.draggable.attr("id");
        var droppableId = $(this).attr("id");

        if( $.inArray(draggableId, needs) > -1 )
        {
            if(! ($.inArray( draggableId, composition_needs[droppableId] ) > -1) ) {
                composition_needs[droppableId].push(draggableId);
                ui.draggable.clone().appendTo($(this));
            }

        }else {

            if(! ($.inArray( draggableId, composition_sensors[droppableId] ) > -1) ) {
                composition_sensors[droppableId].push(draggableId);
                ui.draggable.clone().appendTo($(this));
            }
        }

        displayGenerateButton();
    }


    function displayGenerateButton(){
        for( var i = 0 ; i < composition_sensors.length ; i++ ) {
            if ( composition_sensors[i].length > 1 ) {
                $( "#generateButton" ).show( 700 );
                break;
            }
        }
    }


/*******************************
 **** JSON Of composition ******
 ******************************/


    function getCompositions() {

        var compositions = {};
        compositions.composition = [];

        for( var i = 0 ; i < 3 ; i++ ){
            var employee = {
                "need"   : composition_needs[i],
                "sensors": composition_sensors[i]
            }

            compositions.composition.push(employee);
        }

        //return compositions;
    console.log(composition);
        return JSON.stringify(compositions);
    }
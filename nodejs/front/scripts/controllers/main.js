
var capteurs =
    { "name" : "Buildings", "childContainer" :
        [
        {
            "name":"Templiers Ouest",
            "sensors":[],
            "childContainer":
                [
                    {
                        "name":"4th floor",
                        "sensors":[],
                        "childContainer":
                            [
                                {
                                    "name":"Coffee corner",
                                    "sensors":[],
                                    "childContainer":[],
                                    "filters":["COFFEE","CAFE"],
                                    "directSensor":["LIGHT_CAFE","Coffee_energy","Coffee_power","Window_Coffee","Coffee_machine_power","Coffee_machine_energy"]
                                },
                                {
                                    "name":"Sous repartiteur",
                                    "sensors":[],
                                    "childContainer":[],
                                    "filters":["MW"],
                                    "directSensor":["MW_energy"]
                                },
                                {
                                    "name":"Modalis corridor",
                                    "sensors":[],
                                    "childContainer":
                                        [
                                            {
                                                "name":"Office 445",
                                                "sensors":[],
                                                "childContainer":[],
                                                "filters":["445"],
                                                "directSensor":[]
                                            },
                                            {
                                                "name":"Office 444",
                                                "sensors":[],
                                                "childContainer":[],
                                                "filters":["444"],
                                                "directSensor":["LIGHT_444","TEMP_444"]
                                            },
                                            {
                                                "name":"Office 443",
                                                "sensors":[],
                                                "childContainer":[],
                                                "filters":["443"],
                                                "directSensor":["HEATING_443","TEMP_443","AC_443","PRESENCE_443","DOOR_443","DOOR443STATE","TEMP_443V","WINDOW_443","WINDOW443STATE","AC_443STATE"]
                                            }
                                        ],
                                    "filters":["Modalis","CORRIDOR"],
                                    "directSensor":["NOISE_SPARKS_CORRIDOR","Window_Modalis"]
                                }
                            ],
                        "filters":["SPARKS"],
                        "directSensor":["DOOR_SPARKS"]
                    }
                ],
            "filters":[],
            "directSensor":[]
        }
    ]};


var position = capteurs;
var buildings = capteurs.childContainer;

var previous = [];

init();

function init() {
    previous.push(position);
    explore();
}

function explore() {
    clean();
    var myContent;

    myContent = "<div class=\"row\"> <h3>"+position.name+"</h3></div>";
    $("#add-it").append(myContent);

    for(var i = 0; i < buildings.length; i++){
        myContent = "<div class=\"row\"> <a class=\"node\" id=\""+i+"\">"+buildings[i].name+"</a></div>";
        $("#add-it").append(myContent);
    }

    if (position.directSensor != null) {
        for(var i = 0; i < position.directSensor.length; i++){
            myContent = "<div class=\"row\"> <button class=\"drag\">"+position.directSensor[i]+"</button></div>";
            $("#add-it").append(myContent);
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


/** click on draggable element **/
$( ".drag" ).click(function() {
    alert("drag");
});

/** click on back **/
$( "#goback" ).click(function() {
    if(previous.length > 0){
        position = previous.pop();
        buildings = position.childContainer;
        explore();
    }
});

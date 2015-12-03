/**
 * Algo
 *
 * recuperer le premier étage
 *      si il a des directSensor
 *          afficher
 *      si il a des childContainer
 *          mettre le name en lien
 */

var capteurs =
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
    ];



var current = capteurs;
var current_capt = null;

var previous = [];

init();

function init() {
    explore();
}

function explore() {
    clean();

    for(var i = 0; i < current.length; i++){
        var s = "<div class=\"row\"> <a class=\"node\" id=\""+i+"\">"+current[i].name+"</a></div>"
        $("#add-it").append(s);
    }

    if (current_capt != null) {
        for(var i = 0; i < current_capt.directSensor.length; i++){
            var a = "<div class=\"row\"> <button class=\"drag\">"+current_capt.directSensor[i]+"</button></div>"
            $("#add-it").append(a);
        }
    }
}

function clean() {
    $( "#add-it" ).empty();
}


/** click on node **/


$(document).on('click', '.node', function(el) {
    if(current == capteurs){
        current_capt = null;
    }else{
        current_capt = current[parseInt(el.target.id)];
    }

    previous.push(current);
    current = current[parseInt(el.target.id)].childContainer;
    explore();
});


/** click on draggable element **/
$( ".drag" ).click(function() {
    alert("drag");
});

/** click on back **/
$( "#goback" ).click(function() {
    current = previous.pop();
    explore();
});

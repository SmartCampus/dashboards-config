/**
 * Created by Garance on 22/02/2016.
 */

var sensors = {"sensors": [
    {
        "id": "TEMP443_V",
        "kind": "temp",
        "salle": "s_10"
    },
    {
        "id": "LIGHT_443",
        "kind": "light",
        "salle": "s_58"
    },
    {
        "id": "DOOR_SPARKS",
        "kind": "door",
        "salle": "s_52"
    },
    {
        "id": "DOOR443STATE",
        "kind": "door",
        "salle": "s_57"
    },
    {
        "id": "WINDOW443STATE",
        "kind": "window",
        "salle": "s_12"
    }
]
};

$("#plan-security").ready(function () {
    load_svg("/assets/plan_T1_4e.svg", "fullFloorMap", sensors, put_sensors, {
        "door": "/assets/images/sensorIcons/door.png",
        "window": "/assets/images/sensorIcons/window.png",
        "light": "/assets/images/sensorIcons/light.png",
        "temp": "/assets/images/sensorIcons/temperature.png"
    });
});

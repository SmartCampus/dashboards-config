/**
 * Created by Garance on 22/02/2016.
 */
var theSensors = {"sensors": []};
$.get('http://localhost:8082/sensors?container=Root')
    .done(function (result) {
        var i = 0;
        result.forEach(function (sensor) {
                theSensors.sensors.push({id: sensor.name, kind: sensor.kind, salle: "Bureau_443"});
        });
//$("#left2")
            load_svg("/assets/plan_T1_4e.svg", "fullFloorMap", theSensors, put_sensors, {
                "DOOR": "/assets/images/sensorIcons/door.png",
                "WINDOW": "/assets/images/sensorIcons/window.png",
                "LIGHT": "/assets/images/sensorIcons/light.png",
                "TEMP": "/assets/images/sensorIcons/temperature.png",
                "HEATING": "/assets/images/sensorIcons/heating.png",
                "AC": "/assets/images/sensorIcons/ac.png",
                "ENERGY": "/assets/images/sensorIcons/energy.png",
                "SOUND": "/assets/images/sensorIcons/sound.png"
            });

    });



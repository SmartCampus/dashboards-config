/**
 * Created by Garance on 22/02/2016.
 */
var theSensors = {"sensors": [], "coucou":[]};
$.get('http://localhost:8082/sensors?container=Root')
    .done(function (result) {
        result.forEach(function (sensor) {
            console.log(sensor);
                theSensors.sensors.push({id: sensor.name, kind: sensor.kind, bat:"Templiers Ouest", value: "on", salle: "Bureau_443"});
        });
//$("#left2")
            load_svg("/assets/plan_T1_4e.svg", "fullFloorMap", theSensors, put_sensors, {
                "door": "/assets/images/sensorIcons/door.png",
                "window": "/assets/images/sensorIcons/window.png",
                "light": "/assets/images/sensorIcons/light.png",
                "temp": "/assets/images/sensorIcons/temperature.png",
                "heating": "/assets/images/sensorIcons/heating.png",
                "ac": "/assets/images/sensorIcons/ac.png",
                "energy": "/assets/images/sensorIcons/energy.png",
                "sound": "/assets/images/sensorIcons/sound.png"
            });

    });



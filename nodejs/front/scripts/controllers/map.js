/**
 * Created by Garance on 22/02/2016.
 */
var sensorsList = {"TEMP_442V", }
$.get('http://localhost:8082/sensors?container=Root')
    .done(function (enhancedSensor) {
        allTheNeeds[droppableId].sensors.forEach(function (aSensor) {
            temporarySensorsList.push(aSensor);
        });
        temporarySensorsList.push(enhancedSensor);

        expression.sensorList(temporarySensorsList, function (answer) {
            enhancedSensor["salle"] = (position.name).replace(/ /g,"_");;

$("#plan-security").ready(function () {
    load_svg("/assets/plan_T1_4e.svg", "fullFloorMap", sensors, put_sensors, {
        "door": "/assets/images/sensorIcons/door.png",
        "window": "/assets/images/sensorIcons/window.png",
        "light": "/assets/images/sensorIcons/light.png",
        "temp": "/assets/images/sensorIcons/temperature.png"
    });
});

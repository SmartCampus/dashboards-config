# PFE - SmartCampus Dashboard : Sensor-Container-API

## Description of work

This API is here to mock the data of SmartCampus and sort them in a hierarchical way.
This API wan work with two different ways :
        * Using a snapshot of SmartCampus
        * Calling the API of SmartCampus

### Using a snapshot of SmartCampus

If you want to use a snapshot of the actual version of smartCampus, you have to run :

    $ node init/snapshot.js

This node.js file will create a serie of file in the folder : data/snapshot-smartCampus/snapshot
Only some sensors will be snapshotted, if you want to add more sensor in the snapshot you have to the name of the
sensor in the file :   
     
    $ data/snapshot-smartCampus/interesing-sensors.json

### Using the SmartCampus API

If you want to use the API of SmartCampus, you juste have to add "/old/" in all the route. With this every request
will be route to the old router using only the API of SmartCampus.

## Documentation of the API

We created this API because the one of SmartCampus was not able to give us enough information about the localisation
of the different sensors. In addition we added a lot of information about each sensor we are using. The list of sensors
is avaible in :

    $ data/sensors.json

In addition, we added the notion of containers, which can be a geographical container as a building, or category 
container as the temperature. You can see the list of all the containers we are using in :

    $ data/interface-documentation/containers/containerList.json

In addition you can see the result send by every container in :

    $ data/interface-documentation/containers/

We added the functionnality of sort all the sensors in a hierarchical way. For example, if a sensor is in a office in
a building if you do the request on :

    $ /container/NameOfBuilding/Child

You will receive the building, we all the office which contain some sensors. In addition, you will have all the sensor
in the building. You can have example of all the hierarchical information we implemented in the folder :

    $ data/interface-documentation/hierarchical-information

You can read enhanced infomrmation about a sensor on the route : /sensor/sensorName/fullInformation
If you use the route : /sensor/sensorName/data the information will be send in the same format as the information send
directly by smartCampus
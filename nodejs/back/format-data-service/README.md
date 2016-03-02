# PFE - SmartCampus Dashboard : Format-Data-API

## Description of work

This API is here to change the format of the data used by the front-end, and more specifically HighCharts. In deed,
the format used by SmartCampus to send us data is not matching the format used by HighCharts, and that's why this API
is here to translate from one JSON format to an other.

## List of all the given format :

    $ /sensor/NameOfTheSensor/data

This route give you the information about the sensor with the given name, with the same format that SmartCampus

    $ /sensor/NameOfTheSensor/data

This route will count the percentage of time a door is open or close. This route only work if the category of the sensor 
with the given Name is state. 

    $ /sensor/NameOfTheSensor/data/splitList
    
This route will split the information in two JSON array one with all the State OPEN and an other one with all the state 
CLOSE for example. This route only work if the sensor with the given name is in the category STATE.

    $ /sensor/NameOfTheSensor/data/last
    
This route will give you only the last information of the sensor with the given name.

## Other routes    

Other routes are available to give you information about the containers and the different sensors that are available.  

    $ /sensor/NameOfTheSensor/enhanced
    
This route allow you to have the enhanced information about all the sensors of smartCampus. The enhanced information give 
you information like the category, the unit or the display name of the sensor.

    $ /sensors/common/hierarchical
    
This route allow the user to have all the sensor sorted hierarchialy.
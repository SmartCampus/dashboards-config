# PFE - SmartCampus Dashboard : Sensor-Container-API

## Description of work

This API generate HighCharts widget in function of the information put in the request. This API is a Document-Oriented
API based REST. That is why this API only have two routes.
The first one is :

    $ POST : /generationRequest

This post is the main route of the API, it will generate the HTML/Javascript code in function of the JSON you have put
in the body of the POST request. The JSON have to be on the following format : 
{ 
    "job" : "TypeOfGeneration",
    "config" : { Configuration needed in function of the type of generation }
}

At this stage, we only have this list type of generation available : 

    $ ["generateBoolean", "generateGraph", "generatePie", "generateLayout", "generateMap"]

The generateBoolean instruction is here to generate a chart that will represent if the the state sensor is on or off.
If you want to generate the code the "config" parameter have to look like this :

    $ "config" : { 
           "category" : "..",
           "position" : "..",
           "id" : ".."
        }


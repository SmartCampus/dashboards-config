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

You can see the template corresponding to this JSON in :
     
    $ template/BooleanWidget.mustache 

The "generateGraph" instruction is here to generate an HighCharts graph. This is the most complicated generation we use
because it can generate a lot of different graph in function of the input JSON. You can see the template we are using
in  :

    $ template/graph.mustache
    $ template.graph.json
 
The config have to look like this : 

    $ "config" : { 
            "yAxes": "..",
            "graphType" : ".." 
        }                    

The yAxis is an array with all the y axes of the graphe that will be generated. In addition , the graphType is the kind   
of graphe you want to generate. There is three kinds of graphe available : 

    $ ["line","column","scatter"]

The config JSON is then enhanced to be used with the template and generate the javascript needed for the graphe.

The "generatePie" instruction is here to generate a Pie graphe representing the percentage of use of a sensor for example.
You can find the template we are using for the generate of code in :

    $ /template/pie.mustache
    $ /template/pie.json
 
 In addition, the config you have to put to generate the graphe have to look like this :
 
     $ "config" : { 
             "graphName" : "..",
             "seriesArrayName" : ".."
         }
 
The "generateLayout" instruction is here to generate the different kind of layout which means the 50/50 or 33/33/33 or 
the 33/67.
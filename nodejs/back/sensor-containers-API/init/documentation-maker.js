/**
 * Created by Quentin on 2/23/2016.
 */
"use strict";

var http = require("http"),
    localInit = "http://localhost:8081",
    containerPath = "/sensors?container=",
    hierarchicalPath = "/container/",
    fs = require("fs"),
    containerList = JSON.parse(fs.readFileSync("../data/interface-documentation/containers/containerList.json")),
    hierarchicalContainerList = JSON.parse(fs.readFileSync("../data/interface-documentation/hierarchical-information/containerList.json"));


function getContainerInformation(name, callback) {
    var url = localInit + containerPath + name;

    http.get(url, function(res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getContainerInformation");
        });
}

function getHierarchicalSensor(name, callback) {
    var url = localInit + hierarchicalPath + name + "/child";
    http.get(url, function(res) {
        callback(res);
    })
        .on('error', function (e) {
            error(e, "getHierarchicalSensor");
        });

}

function snapShotHierarchical(containerName) {
    getHierarchicalSensor(containerName, function(res) {
        var stringData = "";

        res.on("data", function(chunch) {
            stringData += chunch;
        })

        res.on("end", function() {
            fs.writeFile("../data/interface-documentation/hierarchical-information/hierarchical-" + containerName + ".json", stringData, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("File Hierarchical saved !");
                }
            });
        })
    });
}


function snapShotContainers(containerName) {
    getContainerInformation(containerName, function(res) {
        var stringData = "";
        res.on("data", function(chunck) {
            stringData += chunck;
        });

        res.on("end", function() {
            fs.writeFile("../data/interface-documentation/containers/container-" + containerName +".json", stringData, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("File container saved !")
                }
            });
        })
    })
}


(function createInterfaceDocumentation() {
    for(let i in containerList) {
        snapShotContainers(containerList[i]);
    }

    for(let j in hierarchicalContainerList) {
        snapShotHierarchical(hierarchicalContainerList[j]);
    }
})();

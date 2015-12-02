/**
 * Created by Garance on 24/11/2015.
 */

/**
var tree = [
    {
        text: "Building Templiers",
        nodes: [
            {
                text: "Room 443",
                nodes: [
                    {
                        text: "Temperature"
                    },
                    {
                        text: "Noise"
                    }
                ]
            },
            {
                text: "Room 444"
            },
            {
                text: "Living room",
                nodes: [
                    {
                        text:"Window"
                    }
                ]
            }
        ]
    }];



function getTree() {
    // Some logic to retrieve, or generate tree structure
    return tree;
}

$('#tree').treeview({data: getTree()});

$('#beginTime1').datetimepicker({
    format: 'YYYY-MM-DD HH:mm:ss'
});

$('#endTime1').datetimepicker({
    format: 'YYYY-MM-DD HH:mm:ss'
});

var beginDate = '';
var endDate = '';
    $( "#buttonGenerate" ).click(function() {
        beginDate = $('#beginTime1').data('date');
        endDate = $('#endTime1').data('date');
        window.location = '/summer.html';

});
 **/


/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var redipsInit,		// define redipsInit variable
    setHoverColor,	// set hover color method
    rd;				// reference to the REDIPS.drag library

var besoins = [{key:1, value:"comparison"}, {key:2, value:"proportion"}, {key:3, value: "hierarchy"}, {key:4, value: "distribution"}];
var capteurs = [
    {
        value: "Building Templiers",
        bla: [
            {
                value: "Office 443",
                nodes: [
                    {
                        value: "Temperature"
                    },
                    {
                        value: "Noise"
                    },
                    {
                        value: "Door"
                    },
                    {
                        value: "Window"
                    }
                ]
            },
            {
                value: "Office 444",
                nodes: [
                    {
                        value: "Temperature"
                    },
                    {
                        value: "Noise"
                    },
                    {
                        value: "Door"
                    },
                    {
                        value: "Window"
                    }
                ]
            },
            {
                text: "Office 445",
                nodes: [
                    {
                        value: "Temperature"
                    },
                    {
                        value: "Noise"
                    },
                    {
                        value: "Door"
                    },
                    {
                        value: "Window"
                    }
                ]
            }
        ]
    }];

function init() {

    // update needed
    for(var i = 0; i < besoins.length; i++){
        var s = "<tr><td><div class=\"redips-drag square\">"+besoins[i].value+"</div></td></tr>";
        $("#besoins").append(s);
    }

    // update building captors
    for(var i = 0; i < capteurs.length; i++){
        if(capteurs[i].nodes != null){
            var s = "<tr><td><div>"+capteurs[i].text+"</div></td></tr>";
        }else{
            var s = "<tr><td><div class=\"redips-drag square\">"+capteurs[i].value+"</div></td></tr>";
        }
        $("#capteurs").append(s);
    }
}

// redips initialization
redipsInit = function () {

    init();

    // set reference to the REDIPS.drag library
    rd = REDIPS.drag;
    // initialization
    rd.init();
    // enable cloning DIV elements with pressed SHIFT key
    rd.clone.keyDiv = true;
    // handler clicked - set hover color
    rd.event.clicked = function (currentCell) {
        setHoverColor(currentCell);
    };
    // handler changed - set hover color
    rd.event.changed = function (currentCell) {
        setHoverColor(currentCell);
    };
};


// set hover color
setHoverColor = function (cell) {
    var color,
        tbl = rd.findParent('TABLE', cell);
    // set hover color depending in nested level
    switch (tbl.redips.nestedLevel) {
        // "ground" level table
        case 0:
            color = '#9BB3DA';
            break;
        // first level of nested table
        case 1:
            color = '#FFCFAE';
            break;
        // second level of nested table
        case 2:
            color = '#B9E0C1';
            break;
        // third level of nested table
        case 3:
            color = '#FFFAAE';
            break;
    }
    // set hover color
    rd.hover.colorTd = color;
};


// add onload event listener
if (window.addEventListener) {
    window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
    window.attachEvent('onload', redipsInit);
}
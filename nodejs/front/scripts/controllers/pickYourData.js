/**
 * Created by Garance on 24/11/2015.
 */
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

$('#datetimepicker1').datetimepicker();
$('#datetimepicker2').datetimepicker();
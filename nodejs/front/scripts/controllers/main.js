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

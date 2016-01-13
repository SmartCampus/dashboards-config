/**
 * Created by salahbennour on 06/01/2016.
 */

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

var gridster;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$(function () {

    gridster = $(".gridster ul").gridster({
        widget_base_dimensions: [100, 100],
        widget_margins: [5, 5],
        helper: 'clone',
        resize: {
            enabled: true
        }
    }).data('gridster');

    $('.js-resize-random').on('click', function () {
        gridster.resize_widget(gridster.$widgets.eq(getRandomInt(0, 9)),
            getRandomInt(1, 4), getRandomInt(1, 4))
    });

    $( ".draggable" ).draggable();
    $( ".gridster " ).droppable({
        drop: function( event, ui ) {
            $( ".draggable" ).removeAttr("style");
            $( ".draggable" ).removeAttr("class");

            console.log(ui.draggable);

            gridster.add_widget('<li class="new">'+ui.context+'</li>', 1, 1);

        }
    });

});
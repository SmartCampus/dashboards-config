/**
 * @author Marc Karassev
 */

"use strict";

var LAYOUT_WIDGET_WIDTHS = {
	halfNHalf: {
		"row1" : [
			{"widgetId" : "left1" , "widgetWidth" : "col-md-6"},
			{"widgetId" : "right1" , "widgetWidth" : "col-md-6"}
		],
		"row2" : [
			{"widgetId" : "left2" , "widgetWidth" : "col-md-6"},
			{"widgetId" : "right2" , "widgetWidth" : "col-md-6"}
		],
		"row3" : [
			{"widgetId" : "left3" , "widgetWidth" : "col-md-6"},
			{"widgetId" : "right3" , "widgetWidth" : "col-md-6"}
		]
	},
	threeThirds: {
		"row1" : [
			{"widgetId" : "left1" , "widgetWidth" : "col-md-4"},
			{"widgetId" : "center1" , "widgetWidth" : "col-md-4"},
			{"widgetId" : "right1" , "widgetWidth" : "col-md-4"}
		],
		"row2" : [
			{"widgetId" : "left2" , "widgetWidth" : "col-md-4"},
			{"widgetId" : "center2" , "widgetWidth" : "col-md-4"},
			{"widgetId" : "right2" , "widgetWidth" : "col-md-4"}
		],
		"row3" : [
			{"widgetId" : "left3" , "widgetWidth" : "col-md-4"},
			{"widgetId" : "center3" , "widgetWidth" : "col-md-4"},
			{"widgetId" : "right3" , "widgetWidth" : "col-md-4"}
		]
	}
};

function getLayoutWidgetWidth(layout) {
	for (var property in LAYOUT_WIDGET_WIDTHS) {
		if (property == layout) {
			return LAYOUT_WIDGET_WIDTHS[property];
		}
	}
}

exports.getLayoutWidgetWidth = getLayoutWidgetWidth;
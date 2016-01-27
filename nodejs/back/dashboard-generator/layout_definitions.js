/**
 * @author Marc Karassev
 */

"use strict";

var LAYOUT_WIDGET_WIDTHS = {
	halfNHalf: "col-md-6",
	threeThirds: "col-md-4"
};

function getLayoutWidgetWidth(layout) {
	for (var property in LAYOUT_WIDGET_WIDTHS) {
		if (property == layout) {
			return LAYOUT_WIDGET_WIDTHS[property];
		}
	}
}

exports.getLayoutWidgetWidth = getLayoutWidgetWidth;
/**
 * @author Marc Karassev
 */

"use strict";

var widgetIdList = {
	halfNHalf: ["left1", "right1", "left2", "right2", "left3", "right3"],
	threeThirds: ["left1", "center1" ,"right1" ,"left2", "center2" ,"right2", "left3", "center3" ,"right3"],
	oneThirdTwoThirds: ["left1", "right1", "left2", "right2", "left3", "right3"],

}


var LAYOUT_WIDGET_WIDTHS = {
	halfNHalf: {
		"row1" : [
			{"widgetId" : widgetIdList.halfNHalf[0] , "widgetWidth" : "col-md-6"},
			{"widgetId" : widgetIdList.halfNHalf[1] , "widgetWidth" : "col-md-6"}
		],
		"row2" : [
			{"widgetId" : widgetIdList.halfNHalf[2] , "widgetWidth" : "col-md-6"},
			{"widgetId" : widgetIdList.halfNHalf[3] , "widgetWidth" : "col-md-6"}
		],
		"row3" : [
			{"widgetId" : widgetIdList.halfNHalf[4] , "widgetWidth" : "col-md-6"},
			{"widgetId" : widgetIdList.halfNHalf[5] , "widgetWidth" : "col-md-6"}
		]
	},
	threeThirds: {
		"row1" : [
			{"widgetId" : widgetIdList.threeThirds[0] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.threeThirds[1] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.threeThirds[2] , "widgetWidth" : "col-md-4"}
		],
		"row2" : [
			{"widgetId" : widgetIdList.threeThirds[3] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.threeThirds[4] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.threeThirds[5] , "widgetWidth" : "col-md-4"}
		],
		"row3" : [
			{"widgetId" : widgetIdList.threeThirds[6] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.threeThirds[7] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.threeThirds[8] , "widgetWidth" : "col-md-4"}
		]
	},
	oneThirdTwoThirds: {
		"row1" : [
			{"widgetId" : widgetIdList.oneThirdTwoThirds[0] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.oneThirdTwoThirds[1] , "widgetWidth" : "col-md-8"}
		],
		"row2" : [
			{"widgetId" : widgetIdList.oneThirdTwoThirds[2] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.oneThirdTwoThirds[3] , "widgetWidth" : "col-md-8"}
		],
		"row3" : [
			{"widgetId" : widgetIdList.oneThirdTwoThirds[4] , "widgetWidth" : "col-md-4"},
			{"widgetId" : widgetIdList.oneThirdTwoThirds[5] , "widgetWidth" : "col-md-8"}
		]
	}
};

var dragnDropLayout = {
	halfNHalf : {
		"row" : [
			{"divId" : "sortable1" , "divWidth" : "col-md-6 connectedSortable", "widgets" : [
					{"widgetId" : "left1"},
					{"widgetId" : "left2"}
				]
			},
			{"divId" : "sortable2" , "divWidth" : "col-md-6 connectedSortable", "widgets" : [
					{"widgetId" : "right1"},
					{"widgetId" : "right2"}
				]
			}
		]
	},
	threeThirds : {
		"row" : [
			{"divId" : "sortable1" , "divWidth" : "col-md-4 connectedSortable", "widgets" : [
					{"widgetId" : "left1"},
					{"widgetId" : "left2"}
				]
			},
			{"divId" : "sortable2" , "divWidth" : "col-md-4 connectedSortable", "widgets" : [
					{"widgetId" : "center1"},
					{"widgetId" : "center2"}
				]
			},
			{"divId" : "sortable3" , "divWidth" : "col-md-4 connectedSortable", "widgets" : [
					{"widgetId" : "right1"},
					{"widgetId" : "right2"}
				]
			}
		]
	},
	oneThirdTwoThirds : {
		"row" : [
			{"divId" : "sortable1" , "divWidth" : "col-md-4 connectedSortable", "widgets" : [
					{"widgetId" : "left1"},
					{"widgetId" : "left2"}
				]
			},
			{"divId" : "sortable2" , "divWidth" : "col-md-8 connectedSortable", "widgets" : [
					{"widgetId" : "right1"},
					{"widgetId" : "right2"}
				]
			}
		]
	}
};


function getLayoutWidgetWidth(layout) {
	for (var property in LAYOUT_WIDGET_WIDTHS) {
		if (property == layout) {
		//	return LAYOUT_WIDGET_WIDTHS[property];
			return dragnDropLayout[property];
		}
	}
}

exports.widgetIdList = widgetIdList;
exports.getLayoutWidgetWidth = getLayoutWidgetWidth;
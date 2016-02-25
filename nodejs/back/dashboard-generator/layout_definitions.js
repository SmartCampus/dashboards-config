/**
 * @author Marc Karassev
 */

"use strict";

var widgetIdList = {
	halfNHalf: ["left1", "right1", "left2", "right2", "left3", "right3", "left4", "right4", "left5", "right5"],
	threeThirds: ["left1", "center1" ,"right1" ,"left2", "center2" ,"right2", "left3", "center3" ,"right3"],
	oneThirdTwoThirds: ["left1", "right1", "left2", "right2", "left3", "right3", "left4", "right4", "left5", "right5"]
};


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
			{ "divWidth" : "col-md-6 sortable", "widgets" : [] },
			{"divWidth" : "col-md-6 sortable", "widgets" : [] }
		]
	},
	threeThirds : {
		"row" : [
			{"divWidth" : "col-md-4 sortable", "widgets" : []},
			{"divWidth" : "col-md-4 sortable", "widgets" : []},
			{"divWidth" : "col-md-4 sortable", "widgets" : []}
		]
	},
	oneThirdTwoThirds : {
		"row" : [
			{"divWidth" : "col-md-4 sortable", "widgets" : []},
			{"divWidth" : "col-md-8 sortable", "widgets" : []}
		]
	}
};


function getLayoutWidgetWidth(layout) {
	var response = {};
	for (var property in LAYOUT_WIDGET_WIDTHS) {
		if (property == layout.layoutType) {
			response = JSON.parse(JSON.stringify(dragnDropLayout[property]));
		}
	}

	switch(layout.layoutType) {
		case "halfNHalf":
			for (var i in layout.widgets) {
				if (layout.widgets[i].title === "") {
					response.row[(i%2)].widgets.push({"title": "An awesome graph","widgetId": widgetIdList.halfNHalf[i]	})
				} else {
					response.row[(i%2)].widgets.push({"title": layout.widgets[i].title,	"widgetId": widgetIdList.halfNHalf[i]})
				}
			}
			break;
		case "threeThirds":
			for (var i in layout.widgets) {
				if (layout.widgets[i].title === "") {
					response.row[(i%3)].widgets.push({
						"title": "An awesome graph",
						"widgetId": widgetIdList.threeThirds[i]
					})
				} else {
					response.row[(i%3)].widgets.push({
						"title": layout.widgets[i].title,
						"widgetId": widgetIdList.threeThirds[i]
					})
				}
			}
			break;
		case "oneThirdTwoThirds":
			for (var i in layout.widgets) {
				if (layout.widgets[i].title === "") {
					response.row[(i%2)].widgets.push({
						"title": "An awesome graph",
						"widgetId": widgetIdList.oneThirdTwoThirds[i]
					})
				} else {
					response.row[(i%2)].widgets.push({
						"title": layout.widgets[i].title,
						"widgetId": widgetIdList.oneThirdTwoThirds[i]
					})
				}
			}
			break;
	}
	return response;
}



exports.widgetIdList = widgetIdList;
exports.getLayoutWidgetWidth = getLayoutWidgetWidth;
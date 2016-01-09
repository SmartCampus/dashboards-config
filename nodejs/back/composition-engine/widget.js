/**
 * Created by Quentin on 1/6/2016.
 */
"use strict";

/**
 * This class represent a widget. A widget is define by a number of key words defined in an array and
 * by his name. The key words represent the need of the user for this widget.
 *
 */
class Widget {

    /**
     * This is the constructor of the class that will create the widget with the given {@param name} and
     * given {@param keywords}
     *
     * @param name          {string}
     * @param keyWords      {Array}
     */
    constructor(name, keyWords) {
        this.name = name;
        this.keyWords = keyWords;
    }

    /**
     * This getter return the array of keywords that define the need of the user for the widget.
     *
     * @returns {Array|*}
     */
    getKeyWords() {
        return this.keyWords;
    }

    /**
     * This getter return the name of the widget.
     *
     * @returns {string|*}
     */
    getName() {
        return this.name;
    }
}

var allWidgets = [];
allWidgets.push(new Widget("line", ["Comparison","Overtime"]));
allWidgets.push(new Widget("column", ["Comparison","Overtime", "Proportion"]));
allWidgets.push(new Widget("columnLineCharts", ["Comparison","overtime","Relationships"]));
allWidgets.push(new Widget("pieCharts", ["Comparison"]));

function findCorrespondingWidget(needs, callback) {
    for(var iterator in allWidgets) {
        (function (iterator) {
            var keyWords = allWidgets[iterator].getKeyWords();
            if (keyWords.length == needs.length) {
                if (keyWords.every(function (element) {
                        return (needs.indexOf(element) != -1);
                    }) === true) {
                    callback(allWidgets[iterator].getName());
                }
            }
        })(iterator)
    }
    callback(undefined);
}

exports.findCorrespondingWidget = findCorrespondingWidget;
/**
 * Created by salahbennour on 25/11/2015.
 */


$(function () {
    $('#c1').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Intensité sonore par rapport au couloir'
        },
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true
        }],

        yAxis: [

        { // Primary yAxis
            plotLines: [{
                color: 'red', // Color value
                dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                value: 1, // Value of where the line will appear
                width: 2, // Width of the line
                legend : 'Danger !'
            }],
            min: 0,
            max : 1.5,
            labels: {
                format: '{value} db',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Intensité sonore',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }],
        tooltip: {
            shared: false
        },
        legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [

        {
            name: 'Door state',
            type: 'column',
            data: [0, 0.5, 0.5,0.5, 0.5,0.5, 0.5,0.5, 0.5, 0, 0, 0],
        },
        {
            name: 'Decibel',
            type: 'spline',
            data: [0.7, 1.1, 0.5, 0.5, 0.2, 0.5, 0.2, 0.5, 0.3, 1.3, 1.1, 0.03],
            tooltip: {
                valueSuffix: ' db'
            }
        }]
    });
});

$(function () {
    $('#c2').highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Intensité sonore par rapport à l\'extérieur'
        },
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            crosshair: true
        }],

        yAxis: [

            { // Primary yAxis
                plotLines: [{
                    color: 'red', // Color value
                    dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                    value: 1, // Value of where the line will appear
                    width: 2, // Width of the line
                    legend : 'Danger !'
                }],
                min: 0,
                max : 1.5,
                labels: {
                    format: '{value} db',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Intensité sonore',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }],


        tooltip: {
            shared: false
        },
        legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom',
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
        },
        series: [

            {
                name: 'Windows state',
                type: 'column',
                data: [0, 0.5, 0.5,0.5, 0.5,0.5, 0.5,0.5, 0.5, 0, 0, 0],
            },
            {
                name: 'Decibel',
                type: 'spline',
                data: [0.7, 1.1, 0.5, 0.5, 0.2, 0.5, 0.2, 0.5, 0.3, 1.3, 1.1, 0.03],
                tooltip: {
                    valueSuffix: ' db'
                }
            }]
    });
});


/**
 * CAMENBERTS WINDOWS/DOOR
 */

$(function () {

    $(document).ready(function () {

        // Build the chart
        $('#cam1').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Door'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [
                { name: 'Open',
                    y: 70.0,
                    sliced: true,
                    selected: true
                },{
                    name: 'Close',
                    y: 30.0
                }]
            }]
        });
    });
});

$(function () {

    $(document).ready(function () {

        // Build the chart
        $('#cam2').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Windows'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [
                    { name: 'Open',
                        y: 50.0,
                        sliced: true,
                        selected: true
                    },{
                        name: 'Close',
                        y: 50.0
                    }]
            }]
        });
    });
});


/**
 * GRAPH WINDOWS/DOOR
 */
$(function () {
    $('#g1').highcharts({
        chart: {
            type: 'scatter'

        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Temps'
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Close', 'Open']
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.y} '
                }
            }
        },
        series: [{
            name: 'Close',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 0], [167.5, 0], [159.5, 0], [157.0, 0], [155.8, 0]]

        }, {
            name: 'Open',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 1], [175.3, 1], [193.5, 1], [186.5, 1], [187.2, 1]]
        }]
    });
});

$(function () {
    $('#g2').highcharts({
        chart: {
            type: 'scatter'

        },
        title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Temps'
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Close', 'Open']
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.y} '
                }
            }
        },
        series: [{
            name: 'Close',
            color: 'rgba(223, 83, 83, .5)',
            data: [[161.2, 0], [167.5, 0], [159.5, 0], [157.0, 0], [155.8, 0]]

        }, {
            name: 'Open',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 1], [175.3, 1], [193.5, 1], [186.5, 1], [187.2, 1]]
        }]
    });
});


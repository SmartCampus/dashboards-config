/**
 * Created by salahbennour on 25/11/2015.
 */

$(function () {
    $('#c1').highcharts({
        title: {
            text: 'Intensité sonore par rapport au couloir',
            x: -20 //center
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            min: 0,
            max : 1.5,
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                color: 'red', // Color value
                dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                value: 1, // Value of where the line will appear
                width: 2, // Width of the line
                legend : 'Danger !'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: [{
            name: 'Couloir',
            data: [0.10, 0.19, 0.15, 0.25, 0.2, 0.5, 0.7, 0.81, 0.87, 0.93, 1.11, 0.6]
        },{
            name: 'Door Status',
            data: [0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1]
        }
        ]
    });
});


$(function () {
    $('#c2').highcharts({
        title: {
            text: 'Intensité sonore par rapport à l\'état de la fenêtre',
            x: -20 //center
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                color: 'red', // Color value
                dashStyle: 'longdashdot', // Style of the plot line. Default to solid
                value: 10, // Value of where the line will appear
                width: 2, // Width of the line
                legend : 'Danger !'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
        series: [{
            name: 'Couloir',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
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


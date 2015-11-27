/**
 * Created by salahbennour on 25/11/2015.
 */


$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {

        // Create the chart
        $('#c1').highcharts('StockChart', {

            // titre
            title : {
                text : 'Intensité sonore par rapport à la porte'
            },

            rangeSelector : {
                selected : 1
            },

            yAxis: {

                // legende axe Y
                title: {
                    text: 'Intensité sonore (db)'
                },

                // Affichage seuil
                plotLines: [{
                    value: 2,
                    color: 'red',
                    dashStyle: 'shortdash', //pointillé
                    width: 2,
                    label: {
                        text: 'Seuil du bruit'
                    }
                }],

                // min et max en ordonnées
                min : 0,
            },

            series : [
                // affichage graphe
                {
                    name : 'Intensité sonore',
                    data : data,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                // affichage colonnes
                {
                    type: 'column',
                    name: 'Etat de la porte',
                    data: data,
                }
            ]
        });
    });
});


$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {

        // Create the chart
        $('#c2').highcharts('StockChart', {

            // titre
            title : {
                text : 'Intensité sonore par rapport à la fenêtre'
            },

            rangeSelector : {
                selected : 1
            },

            yAxis: {

                // legende axe Y
                title: {
                    text: 'Intensité sonore (db)'
                },

                // Affichage seuil
                plotLines: [{
                    value: 2,
                    color: 'red',
                    dashStyle: 'shortdash', //pointillé
                    width: 2,
                    label: {
                        text: 'Seuil du bruit'
                    }
                }],

                // min et max en ordonnées
                min : 0,
            },

            series : [
                // affichage graphe
                {
                    name : 'Intensité sonore',
                    data : data,
                    tooltip: {
                        valueDecimals: 2
                    }
                },
                // affichage colonnes
                {
                    type: 'column',
                    name: 'Etat de la fenêtre',
                    data: data,
                }
            ]
        });
    });

});


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


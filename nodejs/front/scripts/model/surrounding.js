/**
 * Created by salahbennour on 25/11/2015.
 */


/**
 * Graphe intensité sonore
 */

$(function () {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-c.json&callback=?', function (data) {
        $('#c1').highcharts('StockChart', {

            // titre
            title : {
                text : 'Intensité sonore par rapport à la porte'
            },

            // Selectionne un interval de temps proposé par default
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
        $('#c2').highcharts('StockChart', {

            // titre
            title : {
                text : 'Intensité sonore par rapport à la fenêtre'
            },

            // Selectionne un interval de temps proposé par default
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


/**
 * Camenbert état de la porte/fenêtre
 */

$(function () {
    $(document).ready(function () {

        $('#cam1').highcharts({

            chart: {
                type: 'pie'
            },

            title: {
                text: 'Door'
            },

            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },

            plotOptions: {

                pie: {
                    allowPointSelect: true,     // selection d'une part
                    cursor: 'pointer',          // affichage avec pointeur
                }

            },

            series: [{
                data: [
                    { name: 'Open', y: 70.0},
                    {name: 'Close', y: 30.0}
                ]
            }]
        });
    });
});

$(function () {
    $(document).ready(function () {

        $('#cam2').highcharts({

            chart: {
                type: 'pie'
            },

            title: {
                text: 'Windows'
            },

            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,     // selection d'une part
                    cursor: 'pointer',          // affichage avec pointeur
                }
            },
            series: [{
                data: [
                    { name: 'Open', y: 50.0},
                    { name: 'Close', y: 50.0}
                ]
            }]
        });
    });
});

/**
 * Graphe de l'état de la porte/fenêtre par rapport au temps
 */

$(function () {
    $('#g1').highcharts({

        chart: {
            type: 'scatter'
        },

        title: {
            text: 'Door status in time'
        },

        xAxis: {
            title: {
                text: 'Time'
            }
        },

        yAxis: {
            title: {
                text: ''
            },
            categories: ['Close', 'Open']
        },

        plotOptions: {
            scatter: {
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} '
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
            text: 'Windows status in time '
        },

        xAxis: {
            title: {
                text: 'Time'
            }
        },

        yAxis: {
            title: {
                text: ''
            },
            categories: ['Close', 'Open']
        },

        plotOptions: {
            scatter: {
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} '
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


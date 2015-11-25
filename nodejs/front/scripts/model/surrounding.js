/**
 * Created by salahbennour on 25/11/2015.
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
            categories: ['Open', 'Close']
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
            data: [[161.2, 1], [167.5, 1], [159.5, 1], [157.0, 1], [155.8, 1]]

        }, {
            name: 'Open',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 0], [175.3, 0], [193.5, 0], [186.5, 0], [187.2, 0]]
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
            categories: ['Open', 'Close']
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
            data: [[161.2, 1], [167.5, 1], [159.5, 1], [157.0, 1], [155.8, 1]]

        }, {
            name: 'Open',
            color: 'rgba(119, 152, 191, .5)',
            data: [[174.0, 0], [175.3, 0], [193.5, 0], [186.5, 0], [187.2, 0]]
        }]
    });
});


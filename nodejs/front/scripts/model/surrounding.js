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
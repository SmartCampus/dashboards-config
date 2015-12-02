    $('#c1').highcharts('StockChart', {
        yAxis: {
            title: {
                text: 'Temperature (Â°C)'
            },
            minTickInterval: 1,

            plotLines: [{
                value: 0,
                color: 'red',
                dashStyle: 'shortdash', //pointillé
                width: 2,
                label: { text: '0°C'}
            }]
        },

        series: temperatureArray
    });
};

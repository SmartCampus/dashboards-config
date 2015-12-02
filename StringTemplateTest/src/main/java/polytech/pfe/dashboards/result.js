    $('#c1').highcharts('StockChart', {
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            minTickInterval: 1,

            plotLines: [{
                value: 0,
                color: 'red',
                dashStyle: 'shortdash', //pointill�
                width: 2,
                label: { text: '0�C'}
            }]
        },

        series: temperatureArray
    });
};

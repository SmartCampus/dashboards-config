    $('#c1').highcharts('StockChart', {
        yAxis: {
            title: {
                text: 'TempÃ©rature (Â°C)'
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
	tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
            valueDecimals: 2
        },
        series: temperatureArray
    });
};

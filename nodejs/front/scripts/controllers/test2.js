$(function () {


    var seriesOptions = [],
        seriesCounter = 0,
        names = ['MSFT', 'AAPL', 'GOOG'];

    /**
     * Create the chart when all data is loaded
     * @returns {undefined}
     */
    function createChart() {

        $('#c2').highcharts('StockChart', {

            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent'
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },

            series: seriesOptions
        });
    }

    /**
     * Load new data depending on the selected min and max
     */
    function afterSetExtremes(e) {

        var chart = $('#container').highcharts();

        chart.showLoading('Loading data from server...');
        $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?start=' + Math.round(e.min) +
            '&end=' + Math.round(e.max) + '&callback=?', function (data) {

            chart.series[0].setData(data);
            chart.hideLoading();
        });
    }

    // See source code from the JSONP handler at https://github.com/highcharts/highcharts/blob/master/samples/data/from-sql.php
    $.getJSON('https://www.highcharts.com/samples/data/from-sql.php?callback=?', function (data) {

        // Add a null value for the end date
        data = [].concat(data, [[Date.UTC(2011, 9, 14, 19, 59), null, null, null, null]]);

        // create the chart
        $('#c3').highcharts('StockChart', {
            chart : {
                type: 'candlestick',
                zoomType: 'x'
            },

            navigator : {
                adaptToUpdatedData: false,
                series : {
                    data : data
                }
            },

            scrollbar: {
                liveRedraw: false
            },

            title: {
                text: 'AAPL history by the minute from 1998 to 2011'
            },

            subtitle: {
                text: 'Displaying 1.7 million data points in Highcharts Stock by async server loading'
            },

            rangeSelector : {
                buttons: [{
                    type: 'hour',
                    count: 1,
                    text: '1h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                inputEnabled: false, // it supports only days
                selected : 4 // all
            },

            xAxis : {
                events : {
                    afterSetExtremes : afterSetExtremes
                },
                minRange: 3600 * 1000 // one hour
            },

            yAxis: {
                floor: 0
            },

            series : [{
                data : data,
                dataGrouping: {
                    enabled: false
                }
            }]
        });
    });

    $.each(names, function (i, name) {

        $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {

            seriesOptions[i] = {
                name: name,
                data: data
            };

            // As we're loading the data asynchronously, we don't know what order it will arrive. So
            // we keep a counter and create the chart when all the data is loaded.
            seriesCounter += 1;

            if (seriesCounter === names.length) {
                createChart();
            }
        });
    });

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=large-dataset.json&callback=?', function (data) {

        // Create a timer
        var start = +new Date();

        // Create the chart
        $('#c1').highcharts('StockChart', {
            chart: {
                events: {
                    load: function () {
                        if (!window.isComparing) {
                            this.setTitle(null, {
                                text: 'Built chart in ' + (new Date() - start) + 'ms'
                            });
                        }
                    }
                },
                zoomType: 'x'
            },

            rangeSelector: {

                buttons: [{
                    type: 'day',
                    count: 3,
                    text: '3d'
                }, {
                    type: 'week',
                    count: 1,
                    text: '1w'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 3
            },

            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },

            title: {
                text: 'Hourly temperatures in Vik i Sogn, Norway, 2009-2015'
            },

            subtitle: {
                text: 'Built chart in ...' // dummy text to reserve space for dynamic subtitle
            },

            series: [{
                name: 'Temperature',
                data: data.data,
                pointStart: data.pointStart,
                pointInterval: data.pointInterval,
                tooltip: {
                    valueDecimals: 1,
                    valueSuffix: '°C'
                }
            }]

        });
    });
});

$(function() {
    $( ".sortable").sortable({
        connectWith: ".sortable",
        handle: 'h3',
        cursor: 'move'
    })
});


$('.apc_column--content').droppable({
    drop: function(event, ui)
    {
        function timeout() {
            $(window).resize();
            console.log("coucou");
        }
        window.setTimeout(function() {
            $(window).resize();
        },100);
    }
});


$(".apc_column--content").sortable({
    placeholder: 'apc_drop-placeholder-blocked',
    forcePlaceholderSize: true,
    items: '.apc_inner_item',
    handle : '.widgetTitle',
    connectWith: ".apc_column--content",
    tolerance: "pointer",
    dropOnEmpty: true,
    distance: 0.5,
    stop: function(event, ui) {
        // that.droppedItem(ui.item, ui.item.index());
    }
});

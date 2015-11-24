/**
 * Created by Garance on 23/11/2015.
 */

var SM_results = '{"values":[{"date":"1434545566","value":"675"},{"date":"1434545567","value":"688"},{"date":"1434545568","value":"676"},{"date":"1434545570","value":"0"},{"date":"1434545571","value":"688"},{"date":"1434545572","value":"676"},{"date":"1434545573","value":"0"},{"date":"1434545574","value":"687"},{"date":"1434545575","value":"676"},{"date":"1434545576","value":"0"},{"date":"1434545844","value":"674"},{"date":"1434545845","value":"686"},{"date":"1434545846","value":"676"},{"date":"1434545848","value":"0"},{"date":"1434546322","value":"674"},{"date":"1434546323","value":"687"},{"date":"1434546324","value":"1"},{"date":"1434546546","value":"674"},{"date":"1434546547","value":"686"},{"date":"1434546548","value":"0"},{"date":"1434546627","value":"674"},{"date":"1434546629","value":"686"},{"date":"1434546630","value":"0"},{"date":"1434546631","value":"687"},{"date":"1434546632","value":"0"},{"date":"1434546680","value":"674"},{"date":"1434546681","value":"686"},{"date":"1434546682","value":"0"},{"date":"1434547000","value":"674"},{"date":"1434547001","value":"687"},{"date":"1434547002","value":"677"},{"date":"1434547003","value":"0"},{"date":"1434547015","value":"666"},{"date":"1434547016","value":"686"},{"date":"1434547017","value":"0"},{"date":"1434547037","value":"674"},{"date":"1434547038","value":"687"},{"date":"1434547039","value":"677"},{"date":"1434547041","value":"0"},{"date":"1434547060","value":"675"},{"date":"1434547061","value":"686"},{"date":"1434547062","value":"675"},{"date":"1434547063","value":"0"},{"date":"1434547075","value":"675"},{"date":"1434547076","value":"688"},{"date":"1434547077","value":"677"},{"date":"1434547078","value":"687"},{"date":"1434547079","value":"676"},{"date":"1434547080","value":"0"},{"date":"1434547221","value":"675"},{"date":"1434547222","value":"687"},{"date":"1434547223","value":"676"},{"date":"1434547224","value":"687"},{"date":"1434547225","value":"0"},{"date":"1434547227","value":"674"},{"date":"1434547228","value":"687"},{"date":"1434547229","value":"676"},{"date":"1434547230","value":"0"},{"date":"1434547231","value":"674"},{"date":"1434547232","value":"674"},{"date":"1434547233","value":"0"},{"date":"1434547234","value":"687"},{"date":"1434547235","value":"0"},{"date":"1434547261","value":"674"}]}';
var coordinates = [];
var data1 = [];

// Transform text to JSON
json = JSON.parse(SM_results);

// Parse and add values of JSON in arrays
for(var i = 0; i < json.values.length; i++)
{
    coordinates.push(parseInt(json.values[i].date));
    data1.push(parseInt(json.values[i].value));
}


$(function () {
    $('#container').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'In vs Out temperature'
        },
        subtitle: {
            text: 'office 310'
        },
        xAxis: {
            categories: coordinates
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'office 310 temperatures',
            data: data1
        }]
    });
});
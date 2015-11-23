var requestSmartcampus = require("./request_smartcampus");

function logRes(req, res) {
  res.on('data', function (chunk) {
    console.log("********** received chunk from", req, "**********\n" + chunk);
  });
  res.on('end', function () {
    console.log("********** end of", req, "**********");
  });
}

requestSmartcampus.getAllSensors(logRes);
requestSmartcampus.getLastSensorData("DOOR_443", false, logRes);
requestSmartcampus.getSensorData("DOOR_443", "2015-10-14 18:00:11", false, logRes);
requestSmartcampus.getSensorData("DOOR_443", "2015-09-01 00:00:00/2015-10-01 00:00:00", true, logRes);
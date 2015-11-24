var requestSmartcampus = require("./request_smartcampus");

function logRes(req, res) {
  res.on('data', function (chunk) {
    console.log("********** received chunk from", req, "**********\n" + chunk);
  });
  res.on('end', function () {
    console.log("********** end of", req, "**********");
  });
}

requestSmartcampus.getAllSensors(function (res) {
	logRes("getAllSensors", res);
});
requestSmartcampus.getLastSensorData("DOOR_443", false, function (res) {
	logRes("getLastSensorData for DOOR_443", res);
});
requestSmartcampus.getSensorData("DOOR_443", "2015-10-14 18:00:11", false, function (res) {
	logRes("getSensorData for DOOR_443 at 2015-10-14 18:00:11", res);
});
requestSmartcampus.getSensorData("DOOR_443", "2015-09-01 00:00:00/2015-10-01 00:00:00",
	true, function (res) {
		logRes("getSensorData for DOOR_443 between 2015-09-01 00:00:00 and 2015-10-01 00:00:00", res);
});
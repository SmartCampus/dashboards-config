var requestSmartcampus = require("./request_smartcampus");

function logRes(req, res) {
  res.on('data', function (chunk) {
    console.log("received chunk from", req, ":\n" + chunk);
  });
  res.on('end', function () {
    console.log("********** end of", req, "**********");
  });
}

requestSmartcampus.getAllSensors(logRes);
requestSmartcampus.getSensorData("DOOR_443", true, false, logRes);
requestSmartcampus.getSensorData("DOOR_443", false, true, logRes);
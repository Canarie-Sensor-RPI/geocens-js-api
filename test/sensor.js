$(document).ready(function() {

  test("returns attributes object", 1, function() {
    var sensor = new Geocens.Sensor();
    ok(sensor.attributes() instanceof Object, "attributes is not object");
  });

});

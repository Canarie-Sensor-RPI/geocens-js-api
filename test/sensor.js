$(document).ready(function() {

  test("returns attributes object", 1, function() {
    var sensor = new Geocens.Sensor();
    ok(sensor.attributes() instanceof Object, "attributes is not object");
  });

  test("attributes returns initialization options", 2, function() {
    var options = {
      unit: "celcius",
      phenName: "airtemperature"
    };
    var sensor = new Geocens.Sensor(options);
    var attributes = sensor.attributes();

    equal(attributes.unit, options.unit);
    equal(attributes.phenName, options.phenName);
  });

});

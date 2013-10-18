$(document).ready(function() {

  module("Sensor");

  test("returns metadata object", 1, function() {
    var sensor = new Geocens.Sensor();
    ok(sensor.metadata instanceof Object, "metadata is not object");
  });

  test("metadata returns initialization options", 2, function() {
    var options = {
      unit: "celcius",
      phenName: "airtemperature"
    };
    var sensor = new Geocens.Sensor(options);
    var attributes = sensor.metadata;

    equal(attributes.unit, options.unit);
    equal(attributes.phenName, options.phenName);
  });

});

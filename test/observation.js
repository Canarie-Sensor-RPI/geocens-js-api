$(document).ready(function() {

  module("SOS Observation");

  test("returns attributes object", 1, function() {
    var observation = new Geocens.Observation();
    ok(observation.attributes() instanceof Object, "attributes is not object");
  });

  test("attributes returns initialization options", 2, function() {
    var options = {
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature"
    };
    var observation = new Geocens.Observation(options);
    var attributes = observation.attributes();

    equal(attributes.offering, options.offering);
    equal(attributes.property, options.property);
  });

});

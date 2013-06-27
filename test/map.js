$(document).ready(function() {

  module("Map");

  test('is defined', 1, function() {
    ok(L.Geocens !== undefined, "L.Geocens is not defined");
  });

  test('datasource returns input data', 1, function() {
    var observation = new Geocens.Observation({
      latitude: 51.07993,
      longitude: -114.131802,
      offering: "Temperature",
      procedure_id: "sensor_1",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      readings: [],
      unit: "Celcius"
    });
    var input = [observation];

    var group = L.Geocens(input);

    equal(group.datasource(), input);
  })

});

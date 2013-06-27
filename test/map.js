$(document).ready(function() {

  module("Map", {
    setup: function() {
      this.observation = new Geocens.Observation({
        latitude: 51.07993,
        longitude: -114.131802,
        offering: "Temperature",
        procedure_id: "sensor_1",
        property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
        readings: [],
        unit: "Celcius"
      });
    }
  });

  test('is defined', 1, function() {
    ok(L.Geocens !== undefined, "L.Geocens is not defined");
  });

  test('datasource returns input data', 1, function() {
    var input = [this.observation];

    var group = L.Geocens(input);

    equal(group.datasource(), input);
  });

  test('custom marker options are applied to markers', 1, function() {
    var input = [this.observation];
    var markerOptions = {
      title: 'Marker'
    };
    var spy = sinon.spy(L, 'marker');

    L.Geocens(input, {
      marker: markerOptions
    });

    ok(spy.calledWith([51.07993, -114.131802], markerOptions), "Marker options not used");

  });

});

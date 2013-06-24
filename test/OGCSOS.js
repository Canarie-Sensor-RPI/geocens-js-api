$(document).ready(function() {

  module("OGC SOS");

  test('is defined', 1, function() {
    ok(Geocens.SOS !== undefined, "Geocens.SOS is not defined");
  });

  module("Data Service with getObservation", {});

  test('makes a request for the observations', 2, function() {
  });

  test('returns an array of "Observation" objects', 2, function() {
  });

  test('sets the `service` property for the Observations returned', 1, function() {
  });

  test('sets the `offering` and `observed_property` properties for the Observations returned', 2, function() {
  });

  module("Init OGC SOS, then getObservation", {});

  test('returns an array of "Observation" objects', 2, function() {
  });

  test('sets the `service` property for the Observations returned', 1, function() {
  });

});

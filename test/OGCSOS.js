$(document).ready(function() {

  module("OGC SOS");

  test('is defined', 1, function() {
    ok(Geocens.SOS !== undefined, "Geocens.SOS is not defined");
  });

  module("Data Service with getObservation", {});

  test('makes a request for the observations', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve observations
    Geocens.SOS.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature"
    });

    // Return observation data
    requests[0].respond(200, { "Content-Type": "application/json" },
                        Fixtures.SOS.Observations[0]);

    equal(requests.length, 1, "Fake server did not receive request");

    var request = requests[0];
    var observationsPath = Geocens.SOS.path + "GetObservations";

    equal(request.url, observationsPath, "Request not made for observations");

    xhr.restore();
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

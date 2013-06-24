$(document).ready(function() {

  module("OGC SOS");

  test('is defined', 1, function() {
    ok(Geocens.SOS !== undefined, "Geocens.SOS is not defined");
  });

  module("Data Service with getObservation", {
    setup: function () {
      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

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
                        JSON.stringify(Fixtures.SOS.Observations[0]));

    equal(requests.length, 1, "Fake server did not receive request");

    var request = requests[0];
    var observationsPath = Geocens.SOS.path + "GetObservations";

    equal(request.url, observationsPath, "Request not made for observations");

    xhr.restore();
  });

  test('returns an array of "Observation" objects', 1, function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      done: function (observations) {
        newObservations = observations;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0])]);
    this.server.respond();

    ok(newObservations instanceof Array, "Data is not an array");
  });

  test('sets the `service` property for the Observations returned', 2, function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      done: function (observations) {
        newObservations = observations;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0])]);
    this.server.respond();

    var first = newObservations[0];

    ok(first !== undefined, "No observations returned");
    ok(first.service !== undefined, "Observation service was not defined");
  });

  test('sets the `offering` and `property` properties for the Observations returned', 2, function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      done: function (observations) {
        newObservations = observations;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0])]);
    this.server.respond();

    var first = newObservations[0];

    equal(first.offering, "Temperature", "Offering incorrect");
    equal(first.property, "urn:ogc:def:property:noaa:ndbc:Water Temperature", "Observed Property incorrect");
  });

  module("Init OGC SOS, then getObservation", {
    setup: function () {
      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('returns an array of "Observation" objects', 1, function() {
    var newObservations, service;

    service = new Geocens.SOS({
      service_url: "http://www.example.com/sos"
    });

    // Retrieve observation data
    service.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      done: function (observations) {
        newObservations = observations;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0])]);
    this.server.respond();

    ok(newObservations instanceof Array, "Data is not an array");
  });

  test('sets the `service` property for the Observations returned', 2, function() {
    var newObservations, service;

    service = new Geocens.SOS({
      service_url: "http://www.example.com/sos"
    });

    // Retrieve observation data
    service.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      done: function (observations) {
        newObservations = observations;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0])]);
    this.server.respond();

    var first = newObservations[0];

    ok(first !== undefined, "No observations returned");
    ok(first.service !== undefined, "Observation service was not defined");
  });

});

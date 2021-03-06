$(document).ready(function() {

  module("OGC SOS");

  test('is defined', 1, function() {
    ok(Geocens.SOS !== undefined, "Geocens.SOS is not defined");
  });

  test('can override translation engine path', 1, function() {
    var originalPath = Geocens.SOS.path;

    var newPath = "http://www.example.com/translation_engine/";
    Geocens.SOS.setPath(newPath);
    ok(Geocens.SOS.path === newPath,
        "Geocens Translation Engine path did not change");

    Geocens.SOS.setPath(originalPath);
  });

  module("OGC SOS with getObservation xhr", {
    setup: function () {
      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = [];

      this.xhr.onCreate = function(request) {
        requests.push(request);
      };
    },

    teardown: function () {
      this.xhr.restore();
    }
  });

  test('requests the observations', 10, function() {
    var ajaxSpy = sinon.spy($, 'ajax');

    // Retrieve observations
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature"
    });

    // Return observation data
    this.requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0]));

    equal(this.requests.length, 1, "Fake server did not receive request");

    var request = this.requests[0];
    var observationsPath = Geocens.SOS.path + "GetObservations";
    var baseRequestUrl = request.url.split('?')[0];

    equal(baseRequestUrl, observationsPath, "Request not made for observations");

    var args = ajaxSpy.args[0][0].data;

    equal(args.service, "http://www.example.com/sos", "Service URL mismatch");
    equal(args.offeringID, "Temperature", "Offering mismatch");
    equal(args.propertyName, "urn:ogc:def:property:noaa:ndbc:Water Temperature",
          "Property mismatch");
    equal(args.topleftLat, 90, "topleftLat mismatch");
    equal(args.topleftLon, -180, "topleftLon mismatch");
    equal(args.bottomrightLat, -90, "bottomrightLat mismatch");
    equal(args.bottomrightLon, 180, "bottomrightLon mismatch");
    equal(args.maxReturn, 10000, "maxReturn mismatch");

    ajaxSpy.restore();
  });

  test('requests the observations with a bounding box', 6, function() {
    var ajaxSpy = sinon.spy($, 'ajax');

    // Retrieve observations
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      northwest: [80, -120],
      southeast: [40, -80]
    });

    // Return observation data
    this.requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0]));

    equal(this.requests.length, 1, "Fake server did not receive request");

    var request = this.requests[0];
    var observationsPath = Geocens.SOS.path + "GetObservations";
    var baseRequestUrl = request.url.split('?')[0];

    equal(baseRequestUrl, observationsPath,
          "Request not made for observations");

    var args = ajaxSpy.args[0][0].data;

    equal(args.topleftLat, 80, "topleftLat mismatch");
    equal(args.topleftLon, -120, "topleftLon mismatch");
    equal(args.bottomrightLat, 40, "bottomrightLat mismatch");
    equal(args.bottomrightLon, -80, "bottomrightLon mismatch");

    ajaxSpy.restore();
  });

test('sets the observations service service_url', 1, function() {
    var rawObservations;

    // Retrieve observations
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      northwest: [80, -120],
      southeast: [40, -80],
      done: function (observations) {
        rawObservations = observations;
      }
    });

    // Return observation data
    this.requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0]));

    var observationService = rawObservations[0].service;

    equal(observationService.service_url, "http://www.example.com/sos", "Service url is not set");
  });

  module("OGC SOS with getObservation", {
    setup: function () {
      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('returns an array of "Observation" objects', 1, function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
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

  test('sets the `service` property for the Observations returned', 2,
    function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
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

  test('sets the `offering`, `property`, and sensor properties for the Observations returned',
        5, function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
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
    equal(first.property, "urn:ogc:def:property:noaa:ndbc:Water Temperature",
          "Observed Property incorrect");

    var attributes = first.attributes();
    equal(attributes.procedure_id, "sensor_1", "Procedure ID incorrect");
    equal(attributes.latitude, "51.07993", "Latitude incorrect");
    equal(attributes.longitude, "-114.131802", "Longitude incorrect");
  });

  test('sets the latest value for the Observations returned', 2, function() {
    var newObservations;

    // Retrieve observation data
    Geocens.SOS.getObservation({
      service_url: "http://www.example.com/sos",
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
    var latest = first.latest();
    equal(latest.timestamp, 1371664800000, "Timestamp incorrect");
    equal(latest.value, 39.859, "Value incorrect");
  });

  module("Init OGC SOS, then getObservation xhr", {
    setup: function () {
      this.xhr = sinon.useFakeXMLHttpRequest();
      var requests = this.requests = [];

      this.xhr.onCreate = function(request) {
        requests.push(request);
      };
    },

    teardown: function () {
      this.xhr.restore();
    }
  });

  test('makes a request for the observations', 10, function() {
    var ajaxSpy = sinon.spy($, 'ajax');

    var service;

    service = new Geocens.SOS({
      service_url: "http://www.example.com/sos"
    });

    // Retrieve observation data
    service.getObservation({
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature"
    });

    // Return observation data
    this.requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.SOS.Observations[0]));

    equal(this.requests.length, 1, "Fake server did not receive request");

    var request = this.requests[0];
    var observationsPath = Geocens.SOS.path + "GetObservations";
    var baseRequestUrl = request.url.split('?')[0];

    equal(baseRequestUrl, observationsPath,
          "Request not made for observations");

    var args = ajaxSpy.args[0][0].data;

    equal(args.service, "http://www.example.com/sos", "Service URL mismatch");
    equal(args.offeringID, "Temperature", "Offering mismatch");
    equal(args.propertyName, "urn:ogc:def:property:noaa:ndbc:Water Temperature",
          "Property mismatch");
    equal(args.topleftLat, 90, "topleftLat mismatch");
    equal(args.topleftLon, -180, "topleftLon mismatch");
    equal(args.bottomrightLat, -90, "bottomrightLat mismatch");
    equal(args.bottomrightLon, 180, "bottomrightLon mismatch");
    equal(args.maxReturn, 10000, "maxReturn mismatch");

    ajaxSpy.restore();
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

  test('sets the `service` property for the Observations returned', 2,
    function() {
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

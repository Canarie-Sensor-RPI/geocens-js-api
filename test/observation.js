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

  test("init sets the service, offering, and property properties", 3, function() {
    var service = new Geocens.SOS({ service_url: "http://www.example.com/sos" });
    var options = {
      service: service,
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature"
    };
    var observation = new Geocens.Observation(options);

    equal(observation.service, service);
    equal(observation.offering, options.offering);
    equal(observation.property, options.property);
  });

  test("latest returns the most recent reading", 1, function() {
    var reading = {
      timestamp: 1371664800000,
      value: 39.859
    };

    var observation = new Geocens.Observation({
      readings: [reading]
    });

    equal(observation.latest(), reading, "Reading not the latest");
  });

  module("SOS Observation getTimeSeries", {
    setup: function () {
      var service = new Geocens.SOS({ service_url: "http://www.example.com/sos" });

      this.observation = new Geocens.Observation({
        service: service,
        offering: "Temperature",
        property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
        latitude: "51.07993",
        longitude: "-114.131802",
        procedure_id: "sensor 1"
      });

      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('responds on success', 1, function() {
    this.server.respondWith([200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]]);

    var callback = sinon.spy();

    // Retrieve time series
    this.observation.getTimeSeries({
      done: callback
    });

    this.server.respond();

    ok(callback.called, "Done was not called");
  });

  test('sends the service URL', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var matches = request.url.match($.param({
      service: "http://www.example.com/sos"
    }));

    ok(matches !== null, "service was not specified");

    xhr.restore();
  });



});

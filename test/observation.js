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

  test('returns timestamp/value array', 5, function() {
    this.server.respondWith([200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]]);

    var seriesData;

    // Retrieve time series
    this.observation.getTimeSeries({
      done: function (data) {
        seriesData = data;
      }
    });

    this.server.respond();

    ok(seriesData instanceof Array, "Data is not an array");

    var firstPair = seriesData[0];
    ok(firstPair.timestamp !== undefined, "timestamp property is undefined");
    ok(firstPair.value !== undefined, "value property is undefined");

    ok(!isNaN(firstPair.timestamp), "timestamp is NaN");
    ok(!isNaN(firstPair.value), "value is NaN");
  });

module("SOS Observation getTimeSeries Request", {
  setup: function() {
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    this.xhr.onCreate = function(request) {
      requests.push(request);
    };

    var service = new Geocens.SOS({ service_url: "http://www.example.com/sos" });

    this.observation = new Geocens.Observation({
      service: service,
      offering: "Temperature",
      property: "urn:ogc:def:property:noaa:ndbc:Water Temperature",
      latitude: "51.07993",
      longitude: "-114.131802",
      procedure_id: "sensor 1"
    });
  },

  teardown: function() {
    this.xhr.restore();
  }
});

  test('sends the service URL', 2, function() {
    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      service: "http://www.example.com/sos"
    }));

    ok(match !== -1, "service was not specified");
  });

  test('sends the offering ID', 2, function() {
    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      offeringID: "Temperature"
    }));

    ok(match !== -1, "offeringID was not specified");
  });

  test('sends the property Name', 2, function() {
    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      propertyName: "urn:ogc:def:property:noaa:ndbc:Water Temperature"
    }));

    ok(match !== -1, "propertyName was not specified");
  });

  test('sends the procedure ID', 2, function() {
    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      procedureID: "sensor 1"
    }));

    ok(match !== -1, "procedureID was not specified");
  });

  test('sends the latitude', 2, function() {
    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      lat: "51.07993"
    }));

    ok(match !== -1, "lat was not specified");
  });

  test('sends the longitude', 2, function() {
    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      lon: "-114.131802"
    }));

    ok(match !== -1, "lon was not specified");
  });

  test('sends the current time as the default end time', 2, function() {
    var time = new Date();
    var clock = sinon.useFakeTimers(time.getTime());

    function ISODateString(d) {
      function pad(n){return n<10 ? '0'+n : n}
      return d.getUTCFullYear()+'-'
          + pad(d.getUTCMonth()+1)+'-'
          + pad(d.getUTCDate())+'T'
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())+'Z';
    };

    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      time: ISODateString(time)
    }));

    ok(match !== -1, "end time was not specified");
    clock.restore();
  });

  test('sends the current time - 24 hours as the default start time', 2, function() {
    var time = new Date();
    var clock = sinon.useFakeTimers(time.getTime());

    // Retrieve time series
    this.observation.getTimeSeries({
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      traceHours: 24
    }));

    ok(match !== -1, "traceHours was not specified");
    clock.restore();
  });

  test('sends custom end time', 2, function() {
    var time = new Date("2012-01-01T00:00:00Z");
    var clock = sinon.useFakeTimers(time.getTime());

    function ISODateString(d) {
      function pad(n){return n<10 ? '0'+n : n}
      return d.getUTCFullYear()+'-'
          + pad(d.getUTCMonth()+1)+'-'
          + pad(d.getUTCDate())+'T'
          + pad(d.getUTCHours())+':'
          + pad(d.getUTCMinutes())+':'
          + pad(d.getUTCSeconds())+'Z';
    };

    // Retrieve time series
    this.observation.getTimeSeries({
      end_time: time,
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      time: ISODateString(time)
    }));

    ok(match !== -1, "end time was not specified");
    clock.restore();
  });

  test('sends custom start time', 2, function() {
    var start = new Date("2012-02-02T00:00:00Z");
    var end = new Date("2012-02-03T00:00:00Z");
    var clock = sinon.useFakeTimers(start.getTime());

    // Retrieve time series
    this.observation.getTimeSeries({
      start_time: start,
      end_time:   end,
      done: function() {}
    });

    // Return records
    this.requests[0].respond(200, { "Content-Type": "text/plain" },
                        Fixtures.SOS.TimeSeries[0]);

    equal(this.requests.length, 1, "Fake server did not receive requests");

    var request = this.requests[0];
    var match = request.url.indexOf($.param({
      traceHours: 24
    }));

    ok(match !== -1, "traceHours was not specified");
    clock.restore();
  });

});

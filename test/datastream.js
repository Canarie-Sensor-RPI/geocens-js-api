$(document).ready(function() {

  module("Datastream");

  test("returns attributes object", 1, function() {
    var datastream = new Geocens.Datastream();
    ok(datastream.attributes() instanceof Object, "attributes is not object");
  });

  test("attributes returns initialization options", 2, function() {
    var options = {
      unit: "celcius",
      phenName: "airtemperature"
    };
    var datastream = new Geocens.Datastream(options);
    var attributes = datastream.attributes();

    equal(attributes.unit, options.unit);
    equal(attributes.phenName, options.phenName);
  });

  module("Datastream GetTimeSeries", {
    setup: function () {
      this.api_key      = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";
      this.datastream_id = "32_character_datastream_id";

      // Path to resource on Data Service
      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams/" +
                      this.datastream_id + "/records?detail=true";

      // Create service, datastream
      var service = new Geocens.DataService({ api_key: this.api_key });
      this.datastream = new Geocens.Datastream({
        sensor_id:     this.sensor_id,
        datastream_id: this.datastream_id
      });
      this.datastream.service = service;

      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('responds on success', 1, function() {
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);

    var callback = this.spy();

    // Retrieve time series
    this.datastream.getTimeSeries({
      done: callback
    });

    this.server.respond();

    ok(callback.called, "Done was not called");
  });

  test('sends the api key', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve time series
    this.datastream.getTimeSeries();

    equal(1, requests.length, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");

    xhr.restore();

  });

  test('makes a request for the records', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve time series
    this.datastream.getTimeSeries();

    // Return records
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0]));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var records_path = Geocens.DataService.path + "sensors/" + this.sensor_id +
                       "/datastreams/" + this.datastream_id +
                       "/records?detail=true";

    equal(request.url, records_path, "Request not made for records resource");

    xhr.restore();
  });

  test('supports limits on requests', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve time series
    this.datastream.getTimeSeries({
      limit: 1
    });

    // Return records
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0]));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var matches = request.url.match("limit=1");

    ok(matches !== null, "limit was not specified");

    xhr.restore();
  });

  test('supports skips on requests', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve time series
    this.datastream.getTimeSeries({
      skip: 1
    });

    // Return records
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0]));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var matches = request.url.match("skip=1");

    ok(matches !== null, "skip was not specified");

    xhr.restore();
  });

  test('returns timestamp/value array', 5, function() {
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);

    var seriesData;

    // Retrieve time series
    this.datastream.getTimeSeries({
      done: function(data) { seriesData = data; }
    });

    this.server.respond();

    ok(seriesData instanceof Array, "Data is not an array");

    var firstPair = seriesData[0];
    ok(firstPair.timestamp !== undefined, "timestamp property is undefined");
    ok(firstPair.value !== undefined, "value property is undefined");

    ok(!isNaN(firstPair.timestamp), "timestamp is NaN");
    ok(!isNaN(firstPair.value), "value is NaN");
  });

  module("Datastream seriesData", {
    setup: function () {
      var api_key       = "your_32_character_api_key",
          sensor_id     = "32_character_sensor_id",
          datastream_id = "32_character_datastream_id";

      // Path to resource on Data Service
      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams/" +
                      datastream_id + "/records?detail=true";

      // Create service, datastream
      var service = new Geocens.DataService({ api_key: api_key });
      this.datastream = new Geocens.Datastream({
        sensor_id:     sensor_id,
        datastream_id: datastream_id
      });
      this.datastream.service = service;

      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('returns no data when no time series data has been retrieved', 2,
    function() {
    var data = this.datastream.seriesData();

    ok(data instanceof Array, 'seriesData is not an array');
    equal(data.length, 0, 'seriesData is not empty');

  });

  test('returns data when time series data has been retrieved', 1, function() {
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);

    // Retrieve time series
    this.datastream.getTimeSeries();

    this.server.respond();

    var data = this.datastream.seriesData();

    equal(data.length, 2, 'seriesData is empty');
  });

test('returns data when time series data has been retrieved multiple times', 2,
  function() {
    // Retrieve first time series
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);
    this.datastream.getTimeSeries({
      start: new Date("2013-01-01 00:00:00Z"),
      end:   new Date("2013-05-28 00:00:00Z")
    });
    this.server.respond();

    // Retrieve second time series
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[1])]);
    this.datastream.getTimeSeries({
      start: new Date("2012-01-01 00:00:00Z"),
      end:   new Date("2012-05-28 00:00:00Z")
    });
    this.server.respond();

    var data = this.datastream.seriesData();

    equal(data.length, 4, 'seriesData is empty');

    var sortedData = data.slice();
    sortedData.sort(function(a, b) {
      if (a.timestamp < b.timestamp) {
        return -1;
      } else if (a.timestamp > b.timestamp) {
        return 1;
      } else {
        return 0;
      }
    });

    deepEqual(data, sortedData, 'seriesData is not sorted by date');
  });

});

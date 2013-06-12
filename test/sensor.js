$(document).ready(function() {

  module("Sensor");

  test("returns attributes object", 1, function() {
    var sensor = new Geocens.Sensor();
    ok(sensor.attributes() instanceof Object, "attributes is not object");
  });

  test("attributes returns initialization options", 2, function() {
    var options = {
      unit: "celcius",
      phenName: "airtemperature"
    };
    var sensor = new Geocens.Sensor(options);
    var attributes = sensor.attributes();

    equal(attributes.unit, options.unit);
    equal(attributes.phenName, options.phenName);
  });

  test("metadata is no-op for data service sensors", 1, function() {
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService"
    });

    equal(sensor.metadata(), undefined, "Data Service sensor metadata is not a no-op");
  });

  module("Sensor GetTimeSeries");

  test('responds on success', 1, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    var server = this.sandbox.useFakeServer();
    var basePath = Geocens.DataService.path;
    var path = basePath + "datastreams/" + datastream_id + "/records";

    server.respondWith("GET", path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);

    var callback = this.spy();

    // "Retrieve" sensor
    var service = new Geocens.DataService({ api_key: api_key });
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService",
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });
    sensor.service = service;

    // Retrieve time series
    sensor.getTimeSeries({
      done: callback
    });

    server.respond();

    ok(callback.called, "Done was not called");

    server.restore();
  });

  test('sends the api key', 2, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // "Retrieve" sensor
    var service = new Geocens.DataService({ api_key: api_key });
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService",
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });
    sensor.service = service;

    // Retrieve time series
    sensor.getTimeSeries();

    equal(1, requests.length, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], api_key, "API mismatch");

    xhr.restore();

  });

  test('returns timestamp/value array', 3, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    var server = this.sandbox.useFakeServer();
    var basePath = Geocens.DataService.path;
    var path = basePath + "datastreams/" + datastream_id + "/records";

    server.respondWith("GET", path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);

    var seriesData;

    // "Retrieve" sensor
    var service = new Geocens.DataService({ api_key: api_key });
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService",
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });
    sensor.service = service;

    // Retrieve time series
    sensor.getTimeSeries({
      done: function(data) { seriesData = data; }
    });

    server.respond();

    ok(seriesData instanceof Array, "Data is not an array");

    var firstPair = seriesData[0];
    ok(firstPair.timestamp !== undefined, "timestamp property is undefined");
    ok(firstPair.value !== undefined, "value property is undefined");

    server.restore();
  });


  module("Sensor seriesData", {
    setup: function () {
      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('returns no data when no time series data has been retrieved', 2, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    // "Retrieve" sensor
    var service = new Geocens.DataService({ api_key: api_key });
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService",
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });
    sensor.service = service;

    var data = sensor.seriesData();

    ok(data instanceof Array, 'seriesData is not an array');
    equal(data.length, 0, 'seriesData is not empty');

  });

  test('returns data when time series data has been retrieved', 1, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    var basePath = Geocens.DataService.path;
    var path = basePath + "datastreams/" + datastream_id + "/records";

    this.server.respondWith("GET", path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);

    // "Retrieve" sensor
    var service = new Geocens.DataService({ api_key: api_key });
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService",
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });
    sensor.service = service;

    // Retrieve time series
    sensor.getTimeSeries();

    this.server.respond();

    var data = sensor.seriesData();

    equal(data.length, 2, 'seriesData is empty');
  });

test('returns data when time series data has been retrieved multiple times', 2, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    var basePath = Geocens.DataService.path;
    var path = basePath + "datastreams/" + datastream_id + "/records";

    // "Retrieve" sensor
    var service = new Geocens.DataService({ api_key: api_key });
    var sensor = new Geocens.Sensor({
      sensor_type: "DataService",
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });
    sensor.service = service;

    // Retrieve first time series
    this.server.respondWith("GET", path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[0])]);
    sensor.getTimeSeries({
      start: new Date("2013-01-01 00:00:00Z"),
      end:   new Date("2013-05-28 00:00:00Z")
    });
    this.server.respond();

    // Retrieve second time series
    this.server.respondWith("GET", path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.TimeSeries[1])]);
    sensor.getTimeSeries({
      start: new Date("2012-01-01 00:00:00Z"),
      end:   new Date("2012-05-28 00:00:00Z")
    });
    this.server.respond();

    var data = sensor.seriesData();

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

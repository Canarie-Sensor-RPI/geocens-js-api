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
                        JSON.stringify(Fixtures.TimeSeries)]);

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

  module("Sensor seriesData");

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

});

$(document).ready(function() {

  module("Data Service");

  test('is defined', 1, function() {
    ok(Geocens.DataService !== undefined, "Geocens.DataService is not defined");
  });

  test('can override data service path', 1, function() {
    var originalPath = Geocens.DataService.path;

    var newPath = "http://dataservice.example.com/";
    Geocens.DataService.setPath(newPath);
    ok(Geocens.DataService.path === newPath, "Geocens Data Service path did not change");

    Geocens.DataService.setPath(originalPath);
  });

  module("Data Service with getSensor", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";
      this.datastream_id = "32_character_datastream_id";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams/" + this.datastream_id;

      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('responds on success', 1, function() {
    this.server.respondWith("GET", this.api_path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);

    var callback = this.spy();

    // Retrieve sensor
    Geocens.DataService.getSensor({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
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

    // Retrieve sensor
    Geocens.DataService.getSensor({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id
    });

    equal(1, requests.length, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");

    xhr.restore();

  });

  test('returns a "Sensor" object', 2, function() {
    this.server.respondWith("GET", this.api_path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);

    var newSensor;

    // Retrieve sensor
    Geocens.DataService.getSensor({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (sensor) {
        newSensor = sensor;
      }
    });

    this.server.respond();

    ok(newSensor !== undefined, "Sensor was not defined");
    // If it looks and acts like a Sensor object…
    ok(newSensor.attributes !== undefined, "Sensor does not respond to attributes()");
  });

  test('sets the `service` property for the Sensor returned', 1, function() {
    this.server.respondWith("GET", this.api_path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);

    var newSensor;

    // Retrieve sensor
    Geocens.DataService.getSensor({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (sensor) {
        newSensor = sensor;
      }
    });

    this.server.respond();

    ok(newSensor.service !== undefined, "Sensor service was not defined");
  });

  module("Init Data Service, then getSensor", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";
      this.datastream_id = "32_character_datastream_id";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams/" + this.datastream_id;

      this.server = sinon.fakeServer.create();
    },

    teardown: function() {
      this.server.restore();
    }
  });

  test('responds on success', 1, function() {
    this.server.respondWith("GET", this.api_path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);

    var callback = this.spy();

    // Retrieve sensor
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getSensor({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
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

    // Retrieve sensor
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getSensor({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id
    });

    equal(1, requests.length, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");
  });

  test('returns a "Sensor" object', 2, function() {
    this.server.respondWith("GET", this.api_path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);

    var newSensor;

    // Retrieve sensor
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getSensor({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (sensor) {
        newSensor = sensor;
      }
    });

    this.server.respond();

    ok(newSensor !== undefined, "Sensor was not defined");
    // If it looks and acts like a Sensor object…
    ok(newSensor.attributes !== undefined, "Sensor does not respond to attributes()");
  });

  test('sets the `service` property for the Sensor returned', 1, function() {
    this.server.respondWith("GET", this.api_path,
                       [200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);

    var newSensor;

    // Retrieve sensor
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getSensor({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (sensor) {
        newSensor = sensor;
      }
    });

    this.server.respond();

    ok(newSensor.service !== undefined, "Sensor service was not defined");
  });

});

$(document).ready(function() {

  module("Data Service");

  test('is defined', 1, function() {
    ok(Geocens.DataService !== undefined, "Geocens.DataService is not defined");
  });

  test('can override data service path', 1, function() {
    var originalPath = Geocens.DataService.path;

    var newPath = "http://dataservice.example.com/";
    Geocens.DataService.setPath(newPath);
    ok(Geocens.DataService.path === newPath,
       "Geocens Data Service path did not change");

    Geocens.DataService.setPath(originalPath);
  });

  module("Data Service with getDatastream", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";
      this.datastream_id = "32_character_datastream_id";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams/" +
                      this.datastream_id;

      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('makes a request for the sensor resource', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve datastream
    Geocens.DataService.getDatastream({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id
    });

    // Return sensor
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    // Return datastream
    requests[1].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    equal(requests.length, 2, "Fake server did not receive requests");

    var request = requests[0];
    var sensor_path = Geocens.DataService.path + "sensors/" + this.sensor_id;

    equal(request.url, sensor_path, "Request not made for sensor resource");

    xhr.restore();
  });

  test('makes a request for the datastream resource', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve datastream
    Geocens.DataService.getDatastream({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id
    });

    // Return sensor
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    // Return datastream
    requests[1].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    equal(requests.length, 2, "Fake server did not receive requests");

    var request = requests[1];
    var datastream_path = Geocens.DataService.path + "sensors/" +
                          this.sensor_id + "/datastreams/" + this.datastream_id;

    equal(request.url, datastream_path,
          "Request not made for datastream resource");

    xhr.restore();
  });

  test('sends the api key', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve datastream
    Geocens.DataService.getDatastream({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id
    });

    equal(1, requests.length, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");

    xhr.restore();

  });

  test('returns a "Datastream" object', 2, function() {
    var newDatastream;

    // Retrieve datastream
    Geocens.DataService.getDatastream({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (datastream) {
        newDatastream = datastream;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);
    this.server.respond();
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastream)]);
    this.server.respond();

    ok(newDatastream !== undefined, "Datastream was not defined");
    // If it looks and acts like a Datastream object…
    ok(newDatastream.attributes !== undefined,
       "Datastream does not respond to attributes()");
  });

  test('sets the `service` property for the Datastream returned', 1,
    function() {
    var newDatastream;

    // Retrieve datastream
    Geocens.DataService.getDatastream({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (datastream) {
        newDatastream = datastream;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);
    this.server.respond();
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastream)]);
    this.server.respond();

    ok(newDatastream.service !== undefined, "Datastream service was not defined");
  });

  test('sets the `datastream_id` and `sensor_id` properties for the Datastream returned',
    2, function() {
    var newDatastream;

    // Retrieve datastream
    Geocens.DataService.getDatastream({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (datastream) {
        newDatastream = datastream;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);
    this.server.respond();
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastream)]);
    this.server.respond();

    equal(newDatastream.datastream_id, this.datastream_id, "Datastream id was not defined");
    equal(newDatastream.sensor_id, this.sensor_id, "Sensor id was not defined");
  });

  module("Init Data Service, then getDatastream", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";
      this.datastream_id = "32_character_datastream_id";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams/" +
                      this.datastream_id;

      this.server = sinon.fakeServer.create();
    },

    teardown: function() {
      this.server.restore();
    }
  });

  test('sends the api key', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve datastream
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getDatastream({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id
    });

    // Return sensor
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    // Return datastream
    requests[1].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    equal(requests.length, 2, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");
  });

  test('returns a "Datastream" object', 2, function() {
    var newDatastream;

    // Retrieve datastream
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getDatastream({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (datastream) {
        newDatastream = datastream;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);
    this.server.respond();
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastream)]);
    this.server.respond();

    ok(newDatastream !== undefined, "Datastream was not defined");
    // If it looks and acts like a Datastream object…
    ok(newDatastream.attributes !== undefined,
       "Datastream does not respond to attributes()");
  });

  test('sets the `service` property for the Datastream returned', 1,
    function() {
    var newDatastream;

    // Retrieve datastream
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getDatastream({
      sensor_id:     this.sensor_id,
      datastream_id: this.datastream_id,
      done: function (datastream) {
        newDatastream = datastream;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);
    this.server.respond();
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastream)]);
    this.server.respond();

    ok(newDatastream.service !== undefined,
       "Datastream service was not defined");
  });

});

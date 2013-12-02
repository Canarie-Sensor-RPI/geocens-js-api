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



  module("Data Service with getSensors", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors";

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

    // Retrieve sensors
    Geocens.DataService.getSensors({
      api_key: this.api_key
    });

    // Return sensor list
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensors));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var sensor_path = Geocens.DataService.path + "sensors?detail=true";

    equal(request.url, sensor_path, "Request not made for sensors resource");

    xhr.restore();
  });

  test('returns a "Sensor" object', 2, function() {
    var newSensor;

    // Retrieve sensor
    Geocens.DataService.getSensors({
      api_key:       this.api_key,
      done: function(sensors) {
        newSensor = sensors[0];
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensors)]);
    this.server.respond();

    ok(newSensor !== undefined, "Sensor was not defined");
    // If it looks and acts like a Sensor object…
    ok(newSensor.getDatastreams !== undefined,
       "Sensor does not respond to getDatastreams()");
  });



  module("Data Service with getRawSensors", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors";

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

    // Retrieve sensors
    Geocens.DataService.getRawSensors({
      api_key: this.api_key
    });

    // Return sensor list
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensors));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var sensor_path = Geocens.DataService.path + "sensors?detail=true";

    equal(request.url, sensor_path, "Request not made for sensors resource");

    xhr.restore();
  });

  test('returns an array of simple JS objects', 2, function() {
    var jsObject;

    // Retrieve sensor
    Geocens.DataService.getRawSensors({
      api_key:       this.api_key,
      done: function(jsObjects) {
        jsObject = jsObjects[0];
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensors)]);
    this.server.respond();

    ok(jsObject !== undefined, "JS Object was not defined");
    // If it does not look and act like a Sensor object…
    ok(jsObject.getDatastreams === undefined,
       "JS Object responds to getDatastreams(), but should not");
  });



  module("Data Service with getSensor", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id;

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

    // Retrieve sensor
    Geocens.DataService.getSensor({
      api_key:       this.api_key,
      sensor_id:     this.sensor_id
    });

    // Return sensor
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var sensor_path = Geocens.DataService.path + "sensors/" + this.sensor_id;

    equal(request.url, sensor_path, "Request not made for sensor resource");

    xhr.restore();
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

  test('sets the `api_key` property for the Datastream service returned', 1,
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

    ok(newDatastream.service.api_key !== undefined, "Datastream service api_key was not defined");
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



  module("Init Data Service, then getSensor", {
    setup: function () {
      this.api_key       = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";

      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id;

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

    source.getSensor({
      sensor_id: this.sensor_id
    });

    // Return sensor
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor));

    equal(requests.length, 1, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");
  });

  test('returns a "Sensor" object', 2, function() {
    var newSensor;

    // Retrieve sensor
    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getSensor({
      sensor_id:     this.sensor_id,
      done: function (sensor) {
        newSensor = sensor;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Sensor)]);
    this.server.respond();

    ok(newSensor !== undefined, "Sensor was not defined");
    // If it looks and acts like a Sensor object…
    ok(newSensor.metadata !== undefined,
       "Sensor does not respond to .metadata");
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



  module("Init Data Service, then getApiKeyStatus", {
    setup: function () {
      this.api_key  = "your_32_character_api_key";
      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "api_keys/" + this.api_key;

      this.server = sinon.fakeServer.create();
    },

    teardown: function() {
      this.server.restore();
    }
  });

  test('makes a request for the api key resource', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve sensors
    Geocens.DataService.getApiKeyStatus({
      api_key: this.api_key
    });

    // Return valid read-only api key
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.ApiKeys.ReadOnly));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var api_key_path = Geocens.DataService.path + "api_keys/" + this.api_key;

    equal(request.url, sensor_path, "Request not made for api keys resource");

    xhr.restore();
  });

  test('returns true for a valid read-write key', 2, function() {
    var keyStatus;

    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getApiKeyStatus({
      api_key: this.api_key,
      done: function(status) {
        keyStatus = status;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.ApiKeys.ReadWrite)]);
    this.server.respond();

    ok(keyStatus !== undefined, "keyStatus was not defined");
    ok(keyStatus, "keyStatus was not read-write");
  });

  test('returns false for a valid read-only key', 2, function() {
    var keyStatus;

    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getApiKeyStatus({
      api_key: this.api_key,
      done: function(status) {
        keyStatus = status;
      }
    });

    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.ApiKeys.ReadOnly)]);
    this.server.respond();

    ok(keyStatus !== undefined, "keyStatus was not defined");
    ok(!keyStatus, "keyStatus was not read-only");
  });

  test('calls fail when key not found', 1, function() {
    var errorMessage;

    var source = new Geocens.DataService({
      api_key: this.api_key
    });

    source.getApiKeyStatus({
      api_key: this.api_key,
      fail: function(error) {
        errorMessage = error;
      }
    });

    this.server.respondWith([404, {}, "Not Found"]);
    this.server.respond();

    ok(errorMessage !== undefined, "errorMessage was not defined");
  });

});

$(document).ready(function() {

  module("Sensor");

  test("returns metadata object", 1, function() {
    var sensor = new Geocens.Sensor();
    ok(sensor.metadata instanceof Object, "metadata is not object");
  });

  test("metadata returns initialization options", 2, function() {
    var options = {
      unit: "celcius",
      phenName: "airtemperature"
    };
    var sensor = new Geocens.Sensor(options);
    var attributes = sensor.metadata;

    equal(attributes.unit, options.unit);
    equal(attributes.phenName, options.phenName);
  });

  test("datastreams returns null when the sensor datastreams have not been retrieved", 1, function() {
    var sensor = new Geocens.Sensor();
    equal(sensor.datastreams, null);
  });

  module("Sensor getDatastreams", {
    setup: function () {
      this.api_key      = "your_32_character_api_key";
      this.sensor_id     = "32_character_sensor_id";

      // Path to resource on Data Service
      var basePath  = Geocens.DataService.path;
      this.api_path = basePath + "sensors/" + this.sensor_id + "/datastreams?detail=true";

      // Create service, sensor
      var service = new Geocens.DataService({ api_key: this.api_key });
      this.sensor = new Geocens.Sensor({
        sensor_id: this.sensor_id
      });
      this.sensor.service = service;

      this.server = sinon.fakeServer.create();
    },

    teardown: function () {
      this.server.restore();
    }
  });

  test('responds on success', 1, function() {
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastreams)]);

    var callback = this.spy();

    // Retrieve datastreams
    this.sensor.getDatastreams({
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

    // Retrieve datastreams
    this.sensor.getDatastreams();

    equal(1, requests.length, "Fake server did not receive request");

    var request = requests[0];

    equal(request.requestHeaders["x-api-key"], this.api_key, "API mismatch");

    xhr.restore();

  });

  test('makes a request for the datastreams', 2, function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    var requests = [];

    xhr.onCreate = function (request) {
      requests.push(request);
    };

    // Retrieve datastreams
    this.sensor.getDatastreams();

    // Return records
    requests[0].respond(200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastreams));

    equal(requests.length, 1, "Fake server did not receive requests");

    var request = requests[0];
    var records_path = Geocens.DataService.path + "sensors/" + this.sensor_id +
                       "/datastreams?detail=true";

    var url = request.url.split('?')[0];

    equal(url, records_path, "Request not made for records resource");

    xhr.restore();
  });

  test("stores the datastreams as Datastream objects", 1, function() {
    this.server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(Fixtures.DataService.Datastreams)]);



    // Retrieve datastreams
    this.sensor.getDatastreams();
    this.server.respond();

    var datastreams = this.sensor.datastreams;

    equal(datastreams.length, 1);
  });

});

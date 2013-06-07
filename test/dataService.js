$(document).ready(function() {

  test('defined', 1, function() {
    ok(Geocens.DataService !== undefined, "Geocens.DataService is not defined");
  });

  test('Data Service path override', 1, function() {
    var originalPath = Geocens.DataService.path;

    var newPath = "http://dataservice.example.com/";
    Geocens.DataService.setPath(newPath);
    ok(Geocens.DataService.path === newPath, "Geocens Data Service path did not change");

    Geocens.DataService.setPath(originalPath);
  });

  module("Data Service getSensor");

  test('responds on success', 1, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    var server = this.sandbox.useFakeServer();
    var path = "http://iot.example.com/sensors/" + sensor_id + "/datastreams/" + datastream_id;

    server.respondWith("GET", path,
                       [200, { "Content-Type": "application/json" },
                        '[{ "id": 12, "message": "Howdy" }]']);

    var callback = this.spy();

    // Retrieve sensor
    Geocens.DataService.getSensor({
      api_key: api_key,
      sensor_id: sensor_id,
      datastream_id: datastream_id,
      done: callback
    });

    server.respond();

    ok(callback.called, "Done was not called");
  });

});

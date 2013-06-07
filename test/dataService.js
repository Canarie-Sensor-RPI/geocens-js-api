$(document).ready(function() {

  test('defined', 1, function() {
    ok(Geocens.DataService !== undefined, "Geocens.DataService is not defined");
  });

  test('Data Service path override', 1, function() {
    var newPath = "http://dataservice.example.com/";
    Geocens.DataService.setPath(newPath);
    ok(Geocens.DataService.path === newPath, "Geocens Data Service path did not change");
  });

  module("Data Service getSensor", {
    setup: function() {
      // mock out Data Service
      var api_key = "your_32_character_api_key",
          sensor_id = "32_character_sensor_id",
          datastream_id = "32_character_datastream_id";

    },

    teardown: function() {

    }
  });

  test('return Sensor object', 1, function() {
    var api_key = "your_32_character_api_key",
        sensor_id = "32_character_sensor_id",
        datastream_id = "32_character_datastream_id";

    // Retrieve sensor
    var sensor = Geocens.DataService.getSensor({
      api_key: api_key,
      sensor_id: sensor_id,
      datastream_id: datastream_id
    });

    ok(sensor !== undefined, "Sensor was not defined");
  });

});

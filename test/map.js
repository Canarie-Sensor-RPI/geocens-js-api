$(document).ready(function() {

  module("Map");

  test('is defined', 1, function() {
    ok(L.Geocens !== undefined, "L.Geocens is not defined");
  });

});

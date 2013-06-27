$(document).ready(function() {

  module("Map");

  test('is defined', 1, function() {
    ok(L.Geocens !== undefined, "L.Geocens is not defined");
  });

  test('datasource returns input data', 1, function() {
    var input = [new Geocens.Observation()];

    var group = L.Geocens(input);

    equal(group.datasource(), input);
  })

});

$(document).ready(function() {

  test('defined', 1, function() {
    ok(Geocens !== undefined, "Geocens is not defined");
  });

  test('includes jQuery', 2, function() {
    ok(Geocens.$ !== undefined, "Geocens.$ is not defined");
    ok(Geocens.$ === jQuery, "Geocens.$ is not jQuery");
  });

});

$(document).ready(function() {

  test('defined', 1, function() {
    ok(Geocens !== undefined, "Geocens is defined");
  });

  test('includes jQuery', 2, function() {
    ok(Geocens.$ !== undefined, "Geocens.$ is defined");
    ok(Geocens.$ === jQuery, "Geocens.$ is jQuery");
  });

});

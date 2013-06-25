$(document).ready(function() {

  module("Chart");

  test('is defined', 2, function() {
    ok($.prototype.Geocens !== undefined, "$.prototype.Geocens is not defined");
    ok($.prototype.Geocens.Chart !== undefined, "$.prototype.Geocens.Chart is not defined");
  });

});

$(document).ready(function() {

  test('noConflict', 2, function() {
    var noConfictGeocens = Geocens.noConflict();
    equal(window.Geocens, undefined, 'Returned window.Geocens');
    window.Geocens = noConfictGeocens;
    equal(window.Geocens, noConfictGeocens,
          'Geocens is still pointing to the original Geocens');
  });

});

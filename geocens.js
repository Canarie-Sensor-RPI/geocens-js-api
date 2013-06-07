//    GeoCENS.js alpha1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function() {

  // Reference to global object
  var root = this;

  // Save previous value of Geocens
  var previousGeocens = root.Geocens;

  // Set top-level namespace
  var Geocens;
  Geocens = root.Geocens = {};

  // Current library version
  Geocens.VERSION = 'alpha1';

  // Require jQuery into `$` variable
  Geocens.$ = root.jQuery || root.$;

  // Run Geocens in noConflict mode, which prevents Geocens from overwriting
  // whatever previously held the `Geocens` variable.
  Geocens.noConflict = function() {
    root.Geocens = previousGeocens;
    return this;
  };

}).call(this);

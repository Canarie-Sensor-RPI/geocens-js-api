//    geocens-chart.js 0.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function () {

  // Reference to global object
  var root = this;

  var $Chart = function () {
    // insert chart call here
  };

  var $Geocens = $.fn.Geocens = function () {};

  $.extend($Geocens, {
    Chart: $Chart
  });

}).call(this);

//    geocens-chart.js 0.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($) {
  var root = this,
      chart;

  chart = root.chart = function(element, options) {
    return this;
  };

  $.fn.GeocensChart = function () {
    var options = arguments[0];
    this.each(function () {
      return new chart(this, options);
    });
  };

})(jQuery);

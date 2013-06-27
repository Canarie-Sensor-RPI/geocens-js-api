//    geocens-map.js 0.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($, L) {

  var GeocensGroup = L.FeatureGroup.extend({

    initialize: function(data, options) {
      console.log("initializing", data, options);
    }

  });

  L.Geocens = function (data, options) {
    return new GeocensGroup(data, options);
  };

})(jQuery, L);

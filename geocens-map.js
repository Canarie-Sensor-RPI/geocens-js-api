//    geocens-map.js 0.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($, L) {

  var GeocensGroup = L.FeatureGroup.extend({

    options: {},

    initialize: function(data, options) {
      console.log("initializing", data, options);

      L.Util.setOptions(this, options);

      this._datasource = data;
      this._layers = {};
      var markers = this._markers = [];
      var markerOptions = this.options.marker;

      // Create markers from datasource(s)
      if (data instanceof Array) {
        $.each(data, function(index) {
          var marker = L.marker(this.location(), markerOptions);
          markers.push(marker);
        });
      } else {
        var marker = L.marker(data.location(), markerOptions);
        markers.push(marker);
      }

      var markerGroup = L.featureGroup(markers);
      var id = L.stamp(markerGroup);
      this._layers[id] = markerGroup;
    },

    datasource: function () {
      return this._datasource;
    }

  });

  L.Geocens = function (data, options) {
    return new GeocensGroup(data, options);
  };

})(jQuery, L);

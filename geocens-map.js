//    geocens-map.js 1.0.1

//    (c) 2013, James Badger, Geo Sensor Web Lab.
//    All Rights Reserved.
//    http://www.geocens.ca/

(function($, L) {

  L.Geocens = L.FeatureGroup.extend({

    options: {
      popupContent: function(datasource, event, marker) {
        return datasource.name();
      }
    },

    initialize: function(data, options) {
      var self = this;

      L.Util.setOptions(this, options);

      this._datasource = data;
      var layers = this._layers = {};
      var markerOptions = this.options.marker;
      var popup = L.popup(this.options.popup);

      // Create markers from datasource(s)
      if (data instanceof Array) {
        $.each(data, function(index) {
          var marker = L.marker(this.location(), markerOptions);
          marker.datasource = this;

          marker.on("click", function(e) {
            if (popup._map !== undefined && popup._map !== null) {
              popup._map.closePopup(popup);
            }

            popup.setLatLng(e.latlng)
                 .setContent(self.options.popupContent(marker.datasource), e, marker);

            marker.bindPopup(popup);
          });

          var id = L.stamp(marker);
          layers[id] = marker;
        });
      } else {
        var marker = L.marker(data.location(), markerOptions);
        var id = L.stamp(marker);
        layers[id] = marker;
      }
    },

    datasource: function () {
      return this._datasource;
    }
  });

  L.geocens = function (data, options) {
    return new L.Geocens(data, options);
  };

})(jQuery, L);
